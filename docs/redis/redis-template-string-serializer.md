---
title: 'RedisTemplate 字符串序列化'
---

# RedisTemplate 字符串序列化

在使用 RedisTemplate 时，自定义序列化器，使用JackSon进行序列化操作

::: code-group

```java [RedisTemplate]
@Bean
@SuppressWarnings(value = {"unchecked", "rawtypes"})
public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
    RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(connectionFactory);
    Jackson2JsonRedisSerializer serializer = new Jackson2JsonRedisSerializer(Object.class);
    ObjectMapper mapper = new ObjectMapper();
    mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    mapper.registerModule(new Jdk8Module())
            .registerModule(new JavaTimeModule())
            .registerModule(new ParameterNamesModule());
    serializer.setObjectMapper(mapper);

    // 使用StringRedisSerializer来序列化和反序列化redis的key值
    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setValueSerializer(serializer);

    // Hash的key也采用StringRedisSerializer的序列化方式
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashValueSerializer(serializer);

    redisTemplate.afterPropertiesSet();
    return redisTemplate;
}
```

```java [Service]
@Autowired
private RedisTemplate<Object, Object> redisTemplate;

public void test(){
    redisTemplate.opsForValue().set("tested", "aaa");
}
```

在使用时发现获取到的值是`"aaa"`,多了双引号,以为是存储的问题,后来发现这里注入的是我们定义的RedisTemplate,所以这个字符串也被Jackson序列化了,所以两边多了双引号。

对于值类型我们确定不需要序列化，而且在使用时确实不会反序列化json的，我们可以直接使用默认的RedisTemplate，即直接注入`RedisTemplate<String, String>`。
