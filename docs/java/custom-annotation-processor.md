---
title: '自定义编译时注解处理器'
outline: deep
---

# 自定义编译时注解处理器

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

## 解析源代码

定义了注解处理器后，一般我们需要获取到使用注解的地方，然后根据注解的信息做相应的处理。比如：注解的属性、被注解的类型、被注解的方法等，要获取这些信息就需要解析源代码。在注解处理器`AbstractProcessor`中提供了一些方法来解析源代码。

```java{1}
@SupportedAnnotationTypes("cn.whlit.demo.Hello") // 注解处理器支持的注解类型
public class MyProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // annotations 是当前注解处理器支持的注解类型
        for (TypeElement annotation : annotations) {
            // roundEnv 是当前编译环境，包含当前编译的源代码文件、注解、类等
            Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(annotation);
            for (Element element : elements) {
                // element 是被注解的元素，可以是类、方法、字段等
                // 通过元素获取元素上的注解
                Hello hello = element.getAnnotation(Hello.class);
            }
        }
        return false;
    }
}
```

## 解析注解的结构

上面我们获取到了注解的元素以及注解的信息，但只是这些是没有太大的意义的，我们想要的期望的类的信息，比如：**类名、方法名、参数名、参数类型、返回值类型**等，我们在注解的value中传入一个类型，我们依据这个类型来进行我们的代码操作逻辑。

::: code-group

```java [HelloService]
@Hello(Item.class)
public interface HelloService {
}
```

```java [Hello]
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface Hello {
    Class<?> value();
}

```

```java [Item]
public class Item {
    private String name;
    private Integer age;
    // ... getter setter
}
```

:::

那么我们要获取这个`Hello`注解上的Item的类型，我们是不是可以直接通过`hello.value()`获取？

```java
@SupportedAnnotationTypes("cn.whlit.demo.Hello") // 注解处理器支持的注解类型
public class MyProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // annotations 是当前注解处理器支持的注解类型
        for (TypeElement annotation : annotations) {
            // roundEnv 是当前编译环境，包含当前编译的源代码文件、注解、类等
            Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(annotation);
            for (Element element : elements) {
                // element 是被注解的元素，可以是类、方法、字段等
                // 通过元素获取元素上的注解
                Hello hello = element.getAnnotation(Hello.class);
                Class<?> value = hello.value();// [!code focus]
            }
        }
        return false;
    }
}
```

在正常的代码编写中我们这样是没有问题的，但是我们是在编译期处理这个注解的，所以在这个地方其实它实际是`TypeMirror`，它表示的是一个类型，而不是一个类。我们可以通过捕获这个异常，然后获取到这个异常中的类型。

```java
try {
    Class<?>[] ignore = validator.value();
} catch (MirroredTypesException e) {
    List<? extends TypeMirror> typeMirrors = e.getTypeMirrors();
}
```

### 获取类型中的名称

在`TypeMirror`中，我们可以通过`getKind()`方法获取到这个类型是什么，它可能是类、接口、包、方法、基础数据类型等。

::: code-group

```java [TypeMirror]
public interface TypeMirror extends javax.lang.model.AnnotatedConstruct {

    TypeKind getKind();

    // ... other methods
}
```

```java [TypeKind]
public enum TypeKind {
    BOOLEAN,
    BYTE,
    SHORT,
    INT,
    LONG,
    CHAR,
    FLOAT,
    DOUBLE,

    VOID,
    NONE,
    NULL,
    ARRAY,

    DECLARED,

    ERROR,
    TYPEVAR,
    WILDCARD,

    PACKAGE,
    EXECUTABLE,

    OTHER,
    UNION,
    INTERSECTION;
}
```

:::

例如我们要获取到这个`Item`的类型，我们可以通过`TypeMirror`的`getKind()`方法获取到值为：`DECLARED`的类型。表明它是一个已以声明的类型，可以是一个类或者接口。所以我们可以转换成`DeclaredType`(继承`TypeMirror`)，然后再继续转换为`TypeElement`(继承`Element`)。

```java
DeclaredType declaredType = (DeclaredType) typeMirror;
TypeElement typeElement = (TypeElement) declaredType.asElement();
String typeName = typeElement.getSimpleName().toString();
String qualifiedName = typeElement.getQualifiedName().toString();
TypeMirror superclass = typeElement.getSuperclass();
List<? extends TypeMirror> interfaces = typeElement.getInterfaces()
```

### 工具类

通过上面的方式我们就获取到了这个类型的声明信息，但是我们没有获取到这个类型的成员变量、方法等信息。当然如果一点一点的去获取这些信息，也是可以的，但是太麻烦了，JDK也封装了些简单的工具类来简化我们的工作。例如：`Elements`、`Types`

```java
@SupportedAnnotationTypes("cn.whlit.demo.Hello") // 注解处理器支持的注解类型
public class MyProcessor extends AbstractProcessor {
     @Override
    public synchronized void init(ProcessingEnvironment processingEnv) {
        super.init(processingEnv);
        Elements elementUtils = processingEnv.getElementUtils();
        Types typeUtils = processingEnv.getTypeUtils();
    }
}
```

### javapoet

但是使用`Elements`和`Types`这两个工具类还是太麻烦了，所以代码生成工具`javapoet`就提供了更快捷的解析方式。

[maven](https://mvnrepository.com/artifact/com.squareup/javapoet)

::: code-group

```java [获取类型]
// 获取类型
TypeName typeName = TypeName.get(typeMirror);
// 获取成员变量和方法
Element element = typeUtils.asElement(typeMirror);
for (Element enclosedElement : element.getEnclosedElements()) {
    if (enclosedElement.getKind().isField()) {
        // 获取成员变量
        String fieldName = enclosedElement.getSimpleName().toString();
        TypeName fieldType = TypeName.get(enclosedElement.asType());
    } else if (enclosedElement.getKind() == ElementKind.METHOD) {
        // 获取方法
        ExecutableElement method = (ExecutableElement) enclosedElement;
        String methodName = method.getSimpleName().toString();
        TypeName returnType = TypeName.get(method.getReturnType());
        // 获取方法参数
        List<? extends VariableElement> parameters = method.getParameters();
        for (VariableElement parameter : parameters) {
            String parameterName = parameter.getSimpleName().toString();
            TypeName parameterType = TypeName.get(parameter.asType());
        }
    }
}
```

```xml [pom.xml]
<!-- https://mvnrepository.com/artifact/com.squareup/javapoet -->
<dependency>
    <groupId>com.squareup</groupId>
    <artifactId>javapoet</artifactId>
    <version>1.13.0</version>
</dependency>
```

:::

## 生成代码

生成代码方式很多，可以手动拼接字符串，可以使用`freemarker`，也可以使用`javapoet`等，只要是能生成完整的有效的代码都可以，这里以`javapoet`为例。

```java
ClassName myClass = ClassName.get("com.example", "MyClass")
// 创建类
TypeSpec.Builder builder = TypeSpec.classBuilder(myClass);
// 添加修饰符
builder.addModifiers(Modifier.PUBLIC);
// 添加继承的类
builder.superclass(typeName); // 上面解析出来的类型
// 添加成员变量
builder.addField(FieldSpec.builder(String.class, "phone", Modifier.PRIVATE).build());
// 添加List<String>类型的成员变量
builder.addField(FieldSpec.builder(ParameterizedTypeName.get(List.class, String.class), "tag", Modifier.PRIVATE).build());
// 添加构造方法
MethodSpec constructor = MethodSpec.constructorBuilder()
        .addModifiers(Modifier.PUBLIC)
        .addParameter(String.class, "name")
        .addStatement("super()")
        .addStatement("super.setName(name)")
        .build();
builder.addMethod(constructor);
// 添加方法
MethodSpec getPhone = MethodSpec.methodBuilder("getPhone")
        .addStatement("return phone")
        .returns(String.class)
        .addModifiers(Modifier.PUBLIC)
        .build();
builder.addMethod(getPhone);
```

`javapoet`还有很多其他的方法，可以参考[javapoet](https://github.com/square/javapoet)

## 参考

- [自定义Java编译时注解处理器](https://blog.csdn.net/u014454538/article/details/122531293)
- [Mapstruct](https://github.com/mapstruct/mapstruct)
- [javapoet](https://github.com/square/javapoet)
