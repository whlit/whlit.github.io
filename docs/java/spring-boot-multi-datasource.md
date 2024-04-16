---
title: Spring Boot Mybatis 多数据源
---

# Spring Boot Mybatis 多数据源

SpringBoot 提供了动态数据源抽象类 `AbstractRoutingDataSource`，通过该类可以实现动态数据源切换。类中定义了一个`Map<Object,DataSource>`类型的数据源集合，通过key获取对应的数据源。

```java
//AbstractRoutingDataSource源码

public abstract class AbstractRoutingDataSource extends AbstractDataSource implements InitializingBean {
    @Nullable
	private Map<Object, DataSource> resolvedDataSources; // map类型的数据源集合，通过key获取对应的数据源
    ...

    @Override
	public Connection getConnection() throws SQLException {
		return determineTargetDataSource().getConnection(); // [!code focus]
	}
    protected DataSource determineTargetDataSource() {
        ...
		Object lookupKey = determineCurrentLookupKey(); // 获取key
		DataSource dataSource = this.resolvedDataSources.get(lookupKey); // 通过key获取对应的数据源 // [!code focus]
		...
		return dataSource;
	}
    @Nullable
	protected abstract Object determineCurrentLookupKey(); // 获取key的方法，可以通过实现该方法来自定义我们的数据源获取逻辑 // [!code focus]
}
```

## 自定义DataSource

定义一个实现`AbstractRoutingDataSource`类的动态数据源，同时定义一个通过`ThreadLocal`实现线程隔离的动态数据源切换。

::: code-group

```java [DynamicDataSource]
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceHolder.getDataSource();
    }
}
```

```java [DataSourceHolder]
public class DataSourceHolder {

    private static final ThreadLocal<String> DATA_SOURCES = new ThreadLocal<>();

    public static void setDataSource(String dataSource) {
        DATA_SOURCES.set(dataSource);
    }

    public static String getDataSource() {
        return DATA_SOURCES.get();
    }

    public static void removeDataSource() {
        DATA_SOURCES.remove();
    }
}
```

:::

## SpringBoot 注册多数据源

注册多数据源实例，并设置到动态数据源中。

::: code-group

```java [DatasourceConfig]
@MapperScan(basePackages = "com.demo.dao", sqlSessionFactoryRef = "sqlSessionFactory") // Mybatis扫描Mapper
@Configuration
public class DatasourceConfig {

    @ConfigurationProperties("spring.datasource.test1") // 根据前缀获取配置并构建实例
    @Bean("test1DataSource")
    public DataSource test() {
        return DataSourceBuilder.create().build();
    }

    @ConfigurationProperties("spring.datasource.test2")
    @Bean("test2DataSource")
    public DataSource test2() {
        return DataSourceBuilder.create().build();
    }

    @Bean("dynamicDataSource")
    public DynamicDataSource dynamicDataSource(@Qualifier("test1DataSource") DataSource test1DataSource,
                                               @Qualifier("test2DataSource") DataSource test2DataSource) {
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("test1", test1DataSource);
        dataSourceMap.put("test2", test2DataSource);
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        dynamicDataSource.setTargetDataSources(dataSourceMap); // 将数据源集合设置到动态数据源中
        return dynamicDataSource;
    }

    @Bean("sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory(@Qualifier("dynamicDataSource") DynamicDataSource dynamicDataSource)
            throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dynamicDataSource); // 设置动态数据源到sqlSessionFactory
        sqlSessionFactoryBean.setTransactionFactory(new SpringManagedTransactionFactory());
        return sqlSessionFactoryBean.getObject();
    }
}
```

```yml [application.yml]
spring:
  datasource:
    test1:
      jdbc-url: jdbc:mysql://localhost:3306/test1?characterEncoding=utf-8
      username: dev
      password: 123456
      driver-class-name: com.mysql.cj.jdbc.Driver
    test2:
      jdbc-url: jdbc:mysql://localhost:3306/test2?characterEncoding=utf-8
      username: dev
      password: 123456
      driver-class-name: com.mysql.cj.jdbc.Driver
```

:::

## Aop 切换数据源

可以通过定义一个Aop切面的方式去切换数据源，例如：根据登录的租户信息切换数据源。

```java
@Aspect
@Configuration
public class DataSourceAspect {

    //设置aop的切入点，在controller层就设置
    @Pointcut("execution(* com.demo.web..*.*(..))")
    public void dataSourcePointcut(){

    }

    @Before("dataSourcePointcut()")
    public void before(){
        //切换数据源，条件可以从用户的登录信息，或者是从入参传入等方式进行数据源的切换，也可以不在aop中进行设置数据源
        DataSourceHolder.setDataSource("test");
    }

    @After("dataSourcePointcut()")
    public void after(){
        //执行完成时清除数据源
        DataSourceHolder.removeDataSource();
    }
}
```
