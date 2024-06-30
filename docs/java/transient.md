---
title: transient 关键字
layout: doc
outline: deep
---

# transient 关键字

Java语言关键字，在对对象进行持久化存储时，用**transient**进行修饰的变量不参与序列化处理

## 序列化

将对象写入到IO流中，以便于存储与磁盘或者是通过网络进行传播，java对象的序列化可以通过实现**Serializable**或者**Externalizable**就可以表明该类可以被序列化

## transient

当对象进行序列化操作时，如果它的某个成员变量我们不希望或者不必要进行序列化时，可在该变量前面加上**transient**关键字进行修饰
例如用户密码我们不希望它被存储于磁盘中就可以对password变量用**transient**关键字进行修饰

```java
public class User implements Serializable {
	private String username;
    private transient String password;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

```

### jdk序列化

```java
public class TransientTest {
    public static void main(String[] args) {
        User user = new User(){{
            setUsername("boss");
            setPassword("kuba");
        }};
        System.out.println("序列化前：" + user.toString());//序列化前：User{username='boss', password='kuba'}
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        new ObjectOutputStream(out).writeObject(user);
        Object obj = new ObjectInputStream(new ByteArrayInputStream(out.toByteArray())).readObject();
        System.out.println("序列化后：" + obj.toString());//序列化后：User{username='boss', password='null'}
    }
}
```

### json序列化

```java
public class TransientTest {
    public static void main(String[] args) {
        User user = new User(){{
            setUsername("boss");
            setPassword("kuba");
        }};
        //Jackson进行序列化
        System.out.println(new ObjectMapper().valueToTree(user).toString());//序列化结果为：{"username":"boss","password":"kuba"}
        //Fastjson进行序列化
        System.out.println(JSON.toJSONString(user));//序列化结果为：{"username":"boss"}
        //Gson进行序列化
        System.out.println(new Gson().toJson(user));//序列化结果为：null
        User user2 = new User();
        user2.setUsername("boss");
        user2.setPassword("kuba");
        //Gson进行序列化
        System.out.println(new Gson().toJson(user2));//序列化结果为：{"username":"boss"}
    }
}
```

注：不要使用双大括号进行初始化，Gson进行序列化会失效，即使后面又对其进行重新赋值也不可以，还是会失效，原因是Gson不可以对匿名内部类进行序列化操作，而双大括号形式的类初始化就是使用的匿名内部类的方式

[双大括号初始化](/java/double-brace-init)
