---
title: Mybatis-Plus 自定义类型转换器
layout: doc
outline: deep
---

# Mybatis-Plus 自定义类型转换器

在Mybatis中，对于特殊类型的处理，需要使用TypeHandler进行转换，同样的Mybatis-Plus提供了对类型转换的支持。

## Mybatis 中使用自定义类型转换器

1. 首先创建自定义的类型转换器，可以实现`org.apache.ibatis.type.TypeHandler`接口，或者直接继承`org.apache.ibatis.type.BaseTypeHandler`。

例如这里我们对`Postgresql`中的`json`类型进行转换，选择继承`org.apache.ibatis.type.BaseTypeHandler`的方式如下：

```java
import com.alibaba.fastjson2.JSON;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.postgresql.util.PGobject;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public abstract class AbstractJsonHandler<T> extends BaseTypeHandler<T> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
            T parameter, JdbcType jdbcType) throws SQLException {
        PGobject obj = new PGobject();
        obj.setType("json");
        obj.setValue(JSON.toJSONString(parameter));
        ps.setObject(i, obj);
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return JSON.parseObject(rs.getString(columnName), getType());
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return JSON.parseObject(rs.getString(columnIndex), getType());
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return JSON.parseObject(cs.getString(columnIndex), getType());
    }

    public abstract Class<T> getType();
}
```

这里我们创建了一个抽象类，和`BaseTypeHandler`一样我们使用了模板方法的设计模式，将json的序列化与反序列化的逻辑定义在抽象类中，实现了`setNonNullParameter`、`getNullableResult`方法，这样我们只需要在对应类型的类型转换器中通过实现`getType`方法返回其对应的类型即可。

2. 在`Mapper.xml`中配置对应的类型转换器，例如：

::: code-group

```xml [UserMapper.xml]
<mapper namespace="com.example.mapper.UserMapper">
    <resultMap id="BaseResultMap" type="com.example.entity.User">
        <id column="id" property="id" jdbcType="INTEGER"/>
        <result column="ext" property="ext" jdbcType="OTHER"
             typeHandler="com.example.handler.UserJsonHandler"/>
    </resultMap>
    <select id="selectById" resultMap="BaseResultMap">
        select * from user where id = #{id}
    </select>
    <insert id="insert" parameterType="com.example.entity.User">
        insert into user (id, ext)
        values
        (#{id}, #{ext, typeHandler=com.example.handler.UserJsonHandler})
    </insert>
</mapper>
```

```java [UserJsonHandler]
import com.example.entity.User;

public class UserJsonHandler extends AbstractJsonHandler<User> {
    @Override
    public Class<User> getType() {
        return User.class;
    }
}
```

:::

## Mybatis-Plus 中使用自定义类型转换器

在`Mybatis-Plus`中，我们通过在实体类上添加`@TableName`和`@TableField`注解来配置对应的表和字段，在这两个注解中同样也提供了对类型转换器的配置。

::: code-group

```java [User.java]
package com.example.entity;

@Data
@TableName(value = "user", autoResultMap = true)
public class User {
    @TableId
    private Integer id;
    @TableField(value = "ext", typeHandler = UserJsonHandler.class)
    private User ext;
}
```

```java [UserJsonHandler]
import com.example.entity.User;

public class UserJsonHandler extends AbstractJsonHandler<User> {
    @Override
    public Class<User> getType() {
        return User.class;
    }
}
```

:::

在`@TableName`中我们添加了`autoResultMap`属性，这个属性表示是否自动创建`ResultMap`，默认为`false`，设置为`true`后，Mybatis-Plus会自动创建一个`ResultMap`，并使用`@TableField`中配置的`typeHandler`进行类型转换。如果不设置`autoResultMap`属性，在查询方法中就不会使用`ResultMap`，而是直接使用`ResultSet`进行结果映射，相当于在`Mapper.xml`中`select`标签中不使用`resultMap`属性而是使用`resultType`属性，这样在mybatis中进行结果集映射时就不会使用到typeHandler了。

## Mybatis-Plus 2.x 中使用自定义类型转换器

在实际使用过程中一些老项目使用的是`Mybatis-Plus 2.x`的版本，由于`2.x`和`3.x`的版本存在较大的一些差异，所以没有对版本进行升级，但`2.x`其实也是可以实现自定义类型转换器的，毕竟`Mybatis-Plus`只是对`Mybatis`的增强。

- `@TableName`没有`autoResultMap`属性: 2.x中该注解没有自动创建`ResultMap`的功能，但可以指定`ResultMap`，所以我们需要手动创建一个`ResultMap`，然后在该注解中指定该`ResultMap`。
- `@TableField`没有`typeHandler`属性: 2.x中该注解没有`typeHandler`属性，但可以通过`el`属性来指定类型转换器，它和在xml中使用`#{ext, typeHandler=com.example.handler.UserJsonHandler}`是一样的。

::: code-group

```java [User.java]
package com.example.entity;

@Data
@TableName(value = "user", resultMap = "BaseResultMap")
public class User {
    @TableId
    private Integer id;
    @TableField(el = "ext, typeHandler=com.example.handler.UserJsonHandler")
    private User ext;
}
```

```java [UserJsonHandler]
import com.example.entity.User;

public class UserJsonHandler extends AbstractJsonHandler<User> {
    @Override
    public Class<User> getType() {
        return User.class;
    }
}
```

```java [UserMapper.xml]
<mapper namespace="com.example.mapper.UserMapper">
    <resultMap id="BaseResultMap" type="com.example.entity.User">
        <id column="id" property="id" jdbcType="INTEGER"/>
        <result column="ext" property="ext" jdbcType="OTHER"
             typeHandler="com.example.handler.UserJsonHandler"/>
    </resultMap>
</mapper>
```

:::
