---
title: 'Idea 调试注解处理器Processor'
outline: deep
---

# Idea 调试注解处理器Processor

平时接触到的注解主要有两种:

- **编译时注解**:通过注解在编译期动态处理一些逻辑。例如：[Lombok](https://projectlombok.org/)的`@Data`、`@Builder`、`@Slf4j`等。

- **运行时注解**:通过反射在运行时动态处理一些逻辑。例如：[Spring](https://spring.io/projects/spring-framework)的`@Component`、`@Service`、`@Repository`等。

编译期注解一般都是自动生成代码，解放一些重复的工作，例如`@Data`自动生成构造方法和getter/setter方法。

编译期注解处理器`Processor`是编译时注解的核心，通过`Processor`可以动态处理一些编译时逻辑，它是注解处理器的接口类，`AnnotationProcessor`是`Processor`的一个抽象类，它已经实现了大部分的流程，我们只需要实现`process`方法即可方便的定义注解处理器。

## 定义注解

定义一个注解，需要使用`@Target`和`@Retention`注解来指定注解的作用范围，以及注解的保留策略。

```java
package cn.whlit.demo;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface Hello {
}
```

`@Target`注解用于指定注解的作用范围，例如：`@Target(ElementType.TYPE)`表示该注解只能用于类上。

`@Retention`注解用于指定注解的保留策略，例如：`@Retention(RetentionPolicy.SOURCE)`表示该注解只在源代码中保留，编译器不会将其保留在编译后的字节码文件中。

## 定义注解处理器

继承`AbstractProcessor`类，并实现`process`方法。

```java
package cn.whlit.demo;

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;
import java.util.Set;

@SupportedAnnotationTypes("cn.whlit.demo.Hello")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MyProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // 处理逻辑
        return false;
    }
}
```

`@SupportedAnnotationTypes`注解用于指定处理器支持的注解类型，例如：`@SupportedAnnotationTypes("cn.whlit.demo.Hello")`表示该处理器支持`cn.whlit.demo.Hello`注解。值是一个字符串数组，用来匹配支持的注解，支持通配符`*`，例如：`@SupportedAnnotationTypes("*")`表示该处理器支持所有注解。

`@SupportedSourceVersion`注解用于指定处理器支持的源代码版本，例如：`@SupportedSourceVersion(SourceVersion.RELEASE_8)`表示该处理器支持Java 8的源代码。

## 注册注解处理器

### 配置SPI

在`resources/META-INF/services`目录下创建一个名为`javax.annotation.processing.Processor`的文件，内容是注解处理器的全类名。

::: code-group

```[resources/META-INF/services/javax.annotation.processing.Processor]
cn.whlit.demo.MyProcessor
```

:::

设置禁止编译期间处理Process，因为不禁止Process，ServiceLoader会加载到所有的Processor，包括我们自己写的，但是我们自己定义Processor还灭有编译生成Class。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <configuration>
                        <compilerArgument>-proc:none</compilerArgument>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### 使用AutoService自动配置

使用Google的AutoService自动配置，不需要手动配置SPI文件，可以自动生成SPI文件。同时也不用禁止Process。只需要在注解处理器类上添加`@AutoService`注解即可，值为`javax.annotation.processing.Processor`类。

::: code-group

```java [MyProcessor.java]
package cn.whlit.demo;

import com.google.auto.service.AutoService;// [!code ++]

import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;
import java.util.Set;

@AutoService(Processor.class)// [!code ++]
@SupportedAnnotationTypes("cn.whlit.demo.Hello")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MyProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        return false;
    }
}
```

```xml [pom.xml]
<dependency>
    <groupId>com.google.auto.service</groupId>
    <artifactId>auto-service</artifactId>
    <version>1.1.1</version>
</dependency>
```

:::

## Idea调试注解处理器

- 添加Remote Debugger

在IDEA中添加Remote Debugger，端口为8000，位置在`Run>Edit Configurations`

![](/java/idea-debug-processor-1.png)

![](/java/idea-debug-processor-2.png)

- 编译

在终端使用`mvnDebug clean compile`命令编译项目，编译会显示监听端口8000。

```sh
$ mvnDebug clean compile
Listening for transport dt_socket at address: 8000
```

- 调试

添加断点，启动之前添加的Remote，使用dubug运行即可调试。

![](/java/idea-debug-processor-3.png)

## 参考

- [Java注解编译期处理AbstractProcessor详解](https://blog.csdn.net/agonie201218/article/details/130940854)
- [IDEA调试注解处理器AbstractProcessor](https://www.jianshu.com/p/d0dd91c7c560)
