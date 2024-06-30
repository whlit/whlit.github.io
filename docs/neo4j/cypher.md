---
title: Cypher
layout: doc
outline: deep
---

# Cypher

Cypher是一种图数据库查询语言，表现力丰富，能高效地查询和更新图数据。

## Cypher概述

### Cypher是什么

Cypher是一种图数据库查询语言，表现力丰富，能高效地查询和更新图数据。

### 模式(Patterns)

Neo4j图由节点和关系构成。节点可能还有标签和属性，关系可能还有类型和属性。节点表达的是实体，关系连接一对节点。节点可以看作关系数据库中的表，但又不完全一样。节点的标签可以看作是表名，属性可以看作是表的列。拥有相同标签的节点通常具有类似的属性，但不必完全一样，这与关系数据库中同一张表的行数据拥有相同的列是不一样的。
节点和关系都是图的简单构建块。模式可以将很多节点和关系编码为任意复杂的想法

#### 节点语法

Cypher采用一对圆括号来表示节点

| 表达式                                                  | 描述                                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `()`                                                    | 匿名节点                                                                                                 |
| `(matrix)`                                              | 赋有变量的节点，将匹配到的节点赋值给matrix，这个变量可以在其他地方进行引用，变量的可见范围局限于单个语句 |
| `(:Movie)`                                              | 匹配标签为Movie的匿名节点                                                                                |
| `(matrix:Movie)`                                        | 匹配标签为Movie的节点并赋值给matrix                                                                      |
| `(matrix:Movie{title : "The Matrix"})`                  | 匹配标签为Movie并且属性title为The Matrix的节点并赋值给matrix                                             |
| `(matrix:Movie{title : "The Matrix", released : 1997})` | 匹配标签为Movie并且属性title为The Matrix以及属性released为1997的节点并赋值给matrix                       |

#### 关系语法

Cypher使用一对短横线(--)表示一个无方向的关系，有方向的关系在其中一段加上一个箭头(-->或者<--),方括号表达式[...]可用于添加详情，里面可以包含变量、属性和类型信息

| 表达式                                | 描述                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--`                                  | 表示无方向关系                                                                                         |
| `-->`                                 | 表示一个有方向的关系                                                                                   |
| `-[role]->`                           | 赋有变量的关系，将匹配到的关系赋值给role，这个变量可以在其他地方进行引用，变量的可见范围局限于单个语句 |
| `-[:ACTED_IN]->`                      | 匹配类型为ACTED_IN的关系                                                                               |
| `-[role:ACTED_IN]->`                  | 匹配类型为ACTED_IN的关系并赋值给role                                                                   |
| `-[role:ACTED_IN{roles : ["Neo"]}]->` | 匹配类型为ACTED_IN并且属性roles为`["Neo"]`的关系并赋值给role                                           |

#### 模式语法

将节点和关系的语法组合在一起可以表达模式，例如

```cypher
(n:Person:Actor{name:"孙红雷"})-[r:ACTED_IN]->(b:Movie{title:"好先生"})
```

#### 模式变量

为了增强模块性和减少重复，Cypher允许将模式赋给一个变量，这使得匹配到的路径可以用于其他表达式，例如

```cypher
n = (:Persion)-[:ACTED_IN]->(:Movie)
```

### 查询和更新图

Cypher既可用于查询又可用于更新图数据

#### 更新语句的结构

一个Cypher查询部分不能同时匹配和更新图数据，每个部分要么读取要么更新它。在更新查询语句中，所有的读取操作必须在任何的写操作发生之前完成。

#### 返回数据

任何查询都可以返回数据。return语句有三个子语句，分别微skip、limit和order by。如果返回的图元素是刚刚删除的数据，需要注意的是这时的数据的指针不在有效，针对它们的任何操作都是未定义的

### 事务

任何更新图的查询都运行在一个事务中。一个更新查询要么全部成功，要么全部失败。Cypher或者创建一个新的事务，或者运行一个已有的事务中。

### 唯一性

当进行模式匹配时，Neo4j将确保单个模式中不会包含匹配到多次的同一个图关系。例如查找一个用户的朋友的朋友时不应该返回该用户。
当然有时又未必一直希望这样，如果查询应该返回该用户，可以通过多个match语句延申匹配关系来实现。

### 兼容性

Cypher不是一尘不变的语言。新版本引入了很多新的功能，一些旧的功能可能会被移除。如果需要的话，旧版本依然可以访问得到。有两种方式可以在查询中选择使用哪个版本：

1. 为所有的查询设置版本：可以通过neo4j.conf中cypher.default_language_version参数来配置Neo4j数据库使用哪个版本的Cypher语言
2. 在查询中指定版本：简单的在查询开始的时候写上版本，如Cypher 2.3.

## 基本语法

### 类型

Cypher处理的所有值都有一个特定的类型。支持的类型有：数值型、字符串、布尔型、节点、关系、路径、映射(Map)、列表(List)。null是任何类型的值

### 表达式

#### 概述

Cypher中的表达式如下：

| 类型                             | 示例                                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| 十进制(整型和双精度型)的字面值： | `13`、`-13333`、`3.14`、`6.022E34`                                                      |
| 十六进制整型字面值(以0x开头)：   | `0x13zf`、`0xFC9A0`、`-0x66eff`                                                         |
| 八进制整型字面值(以0开头)：      | `0223`、`06546`、`-023432`                                                              |
| 字符串字面值：                   | `'Hello'`、`"World"`                                                                    |
| 布尔字面值：                     | `true`、`false`、`TRUE`、`FALSE`                                                        |
| 变量：                           | `n`、`x`、`rel`、`'a friend'`                                                           |
| 属性：                           | `n.prop`、`x.prop`、`rel.thisProperty`、`'a friend'.'(property name)'`                  |
| 动态属性：                       | `n["prop"]`、`rel[n.city + n.zip]`、`map[coll[0]]`                                      |
| 参数：                           | `$param`、`$0`                                                                          |
| 表达式列表：                     | `['a','b']`、`[1,2,3]`、`['a',3,n.property,$param]`、`[]`                               |
| 函数调用：                       | `length(p)`、`nodes(p)`                                                                 |
| 聚合函数：                       | `avg(x.prop)`、`count(*)`                                                               |
| 路径-模式：                      | `(a)-->()<--(b)`                                                                        |
| 计算式：                         | `1=2 and 3<4`                                                                           |
| 返回true或者false的断言表达式：  | `a.prop = 'Hello'`、`length(p)>10`                                                      |
| 正则表达式：                     | `a.name=~'Tob.*'`                                                                       |
| 大小写敏感的字符串匹配表达式：   | `a.surname starts with 'sven'`、`a.surname ends with 'son' or a.surname contains 'son'` |
| case 表达式                      |

#### 转义字符

| 字符          | 含义                                                     |
| ------------- | -------------------------------------------------------- |
| `\\t`         | 制表符                                                   |
| `\\b`         | 退格                                                     |
| `\\n`         | 换行                                                     |
| `\\r`         | 回车                                                     |
| `\\f`         | 换页                                                     |
| `\\'`         | 单引号                                                   |
| `\\"`         | 双引号                                                   |
| `\\\\`        | 反斜杠                                                   |
| `\\uxxxx`     | Unicode UTF-16编码点(4位的十六进制数字必须以"`\\u`"开头) |
| `\\uxxxxxxxx` | Unicode UTF-32编码点(8位的十六进制数字必须以"`\\u`"开头) |

#### case表达式

1. 简单的case表达式计算表达式的值，然后依次与when语句中的表达式进行比较，直到匹配上为止。如果未匹配上，则else中的表达式将作为结果。如果else语句不存在，那么将返回null。语法：

`case test when value then result[when ...][else default]end`

- test:一个有效的表达式
- value:一个表达式，他的结果将与test表达式的结果进行比较
- result:如果value表达式能够与test表达式匹配，他将作为结果表达式
- default:没有匹配的情况下的默认返回式

2. 一般的case表达式按顺序判断断言，直到找到一个为true，然后对应的结果被返回。如果没有找到就返回else的值，如果没有else语句则返回null语法：

`case when predicate then result[when ...][else default]end`

- predicate:判断的断言，已找到一个有效的可选项
- result:如果predicate匹配到，
- result将作为结果表达式
- default:没有匹配的情况下的默认返回表达式

### 变量

当需要引用模式(Pattern)或者查询某一部分的时候，可以对其进行命名。支队不同部分的这些命名被称为变量

### 参数

Cypher支持带参数的查询。参数能够用于where语句中的字面值和表达式，start语句中的索引值、索引查询以及节点和关系的id。参数不能用于属性名、关系类型和标签，因为这些模式将作为查询结构的一部分被编译进查询计划。合法的参数名是字母、数字以及两者的组合。参数以json格式提供，具体如何提交他们取决于所使用的驱动程序。例如：
参数：

```json
{
  "name": "Johan"
}
```

查询语句:

```cypher
match (n) where n.name = $name return n
```

### 运算符

| 运算符                                                      | 说明                                                                    |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| ` +`、`-`、`*`、`/`、`^ `                                   | 数学运算符                                                              |
| ` =`、`<>`、`<`、`>`、`<=`、`>=`、`is null`、`is not null ` | 比较运算符                                                              |
| ` and`、`or`、`xor`、`not `                                 | 布尔运算符                                                              |
| ` +`、`=~ `                                                 | 字符串运算符，连接字符串的为+，正则表达式匹配为=~                       |
| ` +`、`in `                                                 | 列表运算符，列表的连接可通过+运算符，可用in来检查列表中是否存在某个元素 |
| ` ?`、`! `                                                  | Cypher 2.0之后已被移除                                                  |

### 注释

Cypher语言的注释使用//来注释行

### 模式(Patterns)

使用模式可以描述你期望看到的数据的形状。模式描述数据的形式很类似在白板上画出图的形状，通常用圆圈来表示节点、用箭头来表示关系。

#### 节点模式

节点使用一对圆括号表示。例如：

```cypher
(n)
```

#### 关联节点的模式

模式可以描述多个节点及其之间的关系，Cypher使用箭头来表示两个节点之间的关系。例如：

```cypher
(a)-->(b)
```

描述节点和关系的方式可以扩展到任意数量的节点和他们之间的关系。例如：

```cypher
(a)-->(b)<--(c)
```

这一系列的相互关联的节点和关系被称为路径。节点的命名仅仅当后续的模式或者查询中需要使用的时才需要命名。如果不需要可以省略。例如：

```cypher
(a)-->()<--(c)
```

#### 标签

模式除了可以描述节点以外还可以描述标签，例如：

```cypher
(a:User)-->(b)
```

也可以描述一个节点的多个标签，例如：

```cypher
(a:User:Persion)-->(b)
```

#### 指定属性

节点和关系是图的基础结构。Neo4j的节点和关系都可以有属性，这样可以建立更丰富的模型。属性在模式中使用键值对的映射结构来表达，然后用大括号包起来。例如：
节点属性

```cypher
(a{name : 'Tom', sport : 'Brazilian Ju-Jitsu'})
```

关系属性

```cypher
(a)-[{blocked : false}]->(b)
```

模式在create语句中支持使用单个参数来指定属性。例如：

```cypher
create (node $paramName)
```

但是在其他语句中是不行的，因为Cypher在编译查询的时候需要知道具体的属性的名称，以便于高效的匹配。

#### 描述关系

用箭头可以描述两个节点之间的关系：

```cypher
(a)-->(b)
```

无方向的关系：

```cypher
(a)--(b)
```

关系赋值变量：

```cypher
(a)-[r]->(b)
```

给关系指定类型：

```cypher
(a)-[r:type]->(b)
```

匹配多种关系：

```cypher
(a)-[r:type1|type2]->(b)	//只适用于match语句，因为一个关系不能创建多个类型
```

给关系指定类型省略命名：

```cypher
(a)-[:type]->(b)
```

匹配指定关系长度的模式：

```cypher
(a)-[*2]->(b)
```

匹配指定长度范围的关系(即可变长度关系)：

```cypher
(a)-[*3..5]->(b)
```

匹配省略边界长度的关系：

```cypher
(a)-[*3..]->(b)	//长度大于等于3的路径
(a)-[*..5]->(b)	//长度小于等于5的路径
(a)-[*]->(b)	//长度任意的路径
```

#### 赋值给路径变量

Cypher 支持使用标识符给路径命名，例如：

```cypher
p = (a)-[&3..5]->(b)
```

### 列表

#### 概述

使用方括号和一组以逗号分割的元素来创建一个列表

```cypher
return [1,2,3,4]	//返回[1,2,3,4]
range(0, 10)	//返回[0,1,2,3,4,5,6,7,8,9,10]
```

使用方括号来访问列表中的元素

```cypher
return range(0, 10)[1]	//返回1
```

索引可以为负数

```cypher
return range(0, 10)[-1] //返回10
```

也可以在方括号中指定返回指定范围的元素，左闭右开

```cypher
retrun range(0, 10)[0..3]	//返回[0,1,2]
retrun range(0, 10)[0..-5]	//返回[0,1,2,3,4,5]
retrun range(0, 10)[-5..]	//返回[6,7,8,9,10]
retrun range(0, 10)[..3]	//返回[0,1,2]
retrun range(0, 10)[5..15]	//索引越界会直接从越界的地方返回[5,6,7,8,9,10]
```

使用size函数获取列表的长度

```cypher
return size(range(0, 10)[0..3])	//返回3
```

#### List推导式

List推导式(Comprehension)是Cypher中基于已经存在的列表创建一个列表的语法结构。它遵循数学上的集合，代替使用映射和过滤函数。例如：

```cypher
return [x in range(0, 10) where x % 2 = 0 | x ^ 3] as result
```

#### 模式推导式

模式推导式是Cypher基于模式匹配的结果创建列表的一种语法构造。模式推导式将像一般的match语句那样去匹配模式，断言部分与一般的where语句一样，他将产生一个指定的定制投射。例如：

```cypher
match (a:Persion{name : 'Cahrlie Sheen'}) reuturn [(a)-->(b) where b:Movie | b.year] as years
```

#### 字面值映射

Cypher也可以构造映射。通过rest接口可以获取json对象。在java中对应的是`java.uril.Map<String,Object>`。例如：

```cypher
retrun { key : 'Valur', listKey : [{ inner : 'Map1' }, { inner : 'Map2' }]}
```

#### Map映射

Cypher支持一个名为"map projections"的概念，Map投射以指向图实体的且用逗号分隔的变量簇开头，并包含以{}包括起来的映射元素
语法：`map_variable {map_element, [, ...n]}`
一个map元素投射一个或者多个键值对到map映射。这里有4种类型的map投射元素：
属性选择器：投射属性名作为键，map_variable中对应键的值作为键值
字面值项：来自任意表达式的键值对，如`key:<expression>`
变量选择器：投射一个变量，变量名作为键，变量的值作为投射的值。它的语法只有变量
全属性选择器：投射来自map_variable中的所有键值对
投射举例：
找到Charlie Sheen和返回关于他和他参演过的电影。这个例子展示了字面值项类型的map映射，反过来它还在聚合函数collect()中使用了map投射。

```cypher
match (atcor:Persion{name:'Charle Sheen'})-[:ACTED_IN]->(movie:Movie) return actor { .name, .realName, movies: collect(movie {.title, .year})}
```

### 空值

空值null在Cypher中表示未找到或者未定义。从概念上讲，null意味着"一个未找到的未知值"。对待null会与其他值有些不同，例如从节点中获取一个并不存在的属性将返回null。大多数以null作为输入的表达式将返回null。这包括where语句中用于断言的布尔表达式。
null不等于null，两个未知的值并不意味着他们是同一个值。因此null = null返回null而不是true。

#### 空值的逻辑运算

逻辑运算符包括and、or、xor、in、not，把null当作未知的三值逻辑值，and、or、xor的逻辑值表如下：

| a     | b     | a and b | a or b | a xor b |
| ----- | ----- | ------- | ------ | ------- |
| false | false | false   | false  | false   |
| false | null  | false   | null   | null    |
| false | true  | false   | true   | true    |
| true  | false | false   | true   | true    |
| true  | null  | null    | true   | null    |
| true  | true  | true    | true   | false   |
| null  | false | false   | null   | null    |
| null  | null  | null    | null   | null    |
| null  | true  | null    | true   | null    |

#### 空值与in

in运算符遵循类似的逻辑。如果列表中存在某个值，结果就返回true，如果列表包含null值并且没有匹配到值，结果返回null，否则为false。例如：

| 表达式               | 结果    |
| -------------------- | ------- |
| `2 in [1,2,3]`       | `true`  |
| `2 in [1,null,3]`    | `null`  |
| `2 in [1,2,null]`    | `true`  |
| `2 in [1]`           | `false` |
| `2 in []`            | `false` |
| `null in [1,2,3]`    | `null`  |
| `null in [1,null,3]` | `null`  |
| `null in []`         | `false` |

all,any,none和single与in类似，如果可以确切的计算出结果将返回true或者false，否则将返回null

#### 返回空值的表达式

从列表中或者不存在的元素：`[][0],head([])`
试图访问节点或者关系的不存在的属性：`n.missingProperty`
与null做比较：`1<null`
包含null的算术运算：`1+null`
包含任何null参数的函数调用：`sin(null)`

## 语句

语句可以分为三类，读语句、写语句和通用语句。

读语句：[MATCH](#match), [OPTIONAL MATCH](#optional-match), [WHERE](#where),[START](#start),[AGGREGATION](#aggregation),[LOAD CSV](#load-csv)

写语句：[CREATE](#create),[MERGE](#merge),[SET](#set),[DELETE](#delete),[REMOVE](#remove),[FOREACH](#foreach),[CREATE UNIQUE](#create-unique)

通用语句：[RETURN](#return),[ORDER BY](#order-by),[LIMIT](#limit),[SKIP](#skip),[WITH](#with),[UNWIND](#unwind),[UNION](#union),[CALL](#call)

### MATCH

MATCH语句用于指定的模式检索数据库。
MATCH语句通过模式(Pattem)来检索数据库。它常与带有约束或者断言的WHERE语句一起使用，这使得匹配的模式更具体。断言是模式描述的一部分，不能看作是匹配结果的过滤器。这意味着WHERE应当总是与MATCH语句放在-起使用。
MATCH可以出现在查询的开始或者末尾，也可能位于WITH之后。如果它在语句开头，此时不会绑定任何数据。Neo4j 将设计一个搜索去找到匹配这个语句以及WHERE中指定断言的结果。这将牵涉数据库的扫描，搜索特定标签的节点或者搜索一个索引以找到匹配模式的开始点。这个搜索找到的节点和关系可作为一个“绑定模式元素( Bound PattermnElements)”。它可以用于匹配一些子图的模式，也可以用于任何进一步的MATCH语句，Neo4j将使用这些已知的元素来找到更进一步的未知元素。

### OPTIONAL MATCH

OPTINAL MATCH语句用于搜索模式中描述的匹配项，对于找不到的项用null 代替。 OPTINAL MATCH匹配模式与MATCH类似。不同之处在于，如果没有匹配到，OPTINAL MATCH将用null作为未匹配到部分的值。OPTINAL MATCH在Cypher中类似SOL语句中的outer join。
要么匹配整个模式，要么都未匹配。记住，WHERE是模式描述的一部分，匹配的时候就会考虑到WHERE语句中的断言，而不是匹配之后。这对于有多个(OPTINAL)MATCH语句的查询尤其重要，一定要将属于MATCH的WHERE语句与MATCH放在起。

### WHERE

WHERE在MATCH或者OPTIONAL MATCH语句中添加约束，或者与WITH一起使用来过滤结果。
WHERE不能单独使用，它只能作为MATCH、OPTIONAL MATCH、START和WITH的一部分。如果是在WITH和START中，它用于过滤结果。对于MATCH和OPTIONAL MATCH，WHERE为模式增加约束，它不能看作是匹配完成后的结果过滤。

### START

通过遗留索引(Legacy Index)查找开始点。
Cypher中的每一个查询描述了一个模式，一个模式可以有多个开始点。一个开始点是模式中的一个关系或者节点。使用start时，只能通过遗留索引寻找来引出开始点。使用一个不存在的遗留索引将报错。

### AGGREGATION

Cypher支持使用聚合(Aggregation)来计算聚在一起的数据，类似SQL中的group by，聚合函数有多个输入值，然后基于他们计算出一个聚合值。例如avg函数计算多个数值的平均值。

### LOAD CSV

LOAD CSV用于从CSV文件中导入数据。

### CREATE

create语句用于创建图元素：节点和关系。

### MERGE

merge可以确保图数据库中存在某个特定的模式。如果该模式不存在，那就创建他。

### SET

set语句用于更新节点的标签以及节点和关系的属性。set可以使用map中的参数来设置属性。

### DELETE

delete语句用于删除图元素(节点、关系或者路径)。强调不能只删除节点而不删除与之相连的关系。要么显式的删除对应的关系，要么使用detach delete。

### REMOVE

remove语句用于删除图元素的属性和标签。

### FOREACH

foreach语句用于更新列表中的数据，或者来自路径的组件，或者来自聚合的结果。
列表(List)和路径(Paths)式Cypher中的关键概念，可以使用froeach来更新其中的数据。它可以在路径或者聚合的列表的每一个元素上执行更新命令。foreach括号内的变量是与外部分开的，不能用于该语句之外。
在foreach括号内，可以执行任何的更新命令，包括create、create unique、delete和foreach。如果希望对列表中的每个元素执行额外的match命令，使用unwind更合适。

### CREATE UNIQUE

create unique语句相当于match和create的混合体，即尽可能的匹配，然后创建未匹配的。

### RETURN

return语句定义了查询结果集中返回的内容。可以是节点、关系或者是它们的属性。

### ORDER BY

order by是紧跟return或者是with的字句，它指定了输出的结果应该如何排序。
在变量的范围方面，order by遵循特定的规则，这取决于return的投射或者with语句是否聚合或者distinct。如果他是一个聚合或者distinct投射，那么只有投射中的变量可以使用。如果投射不修改输出基数(聚合和distinct做的)，在投射之前可用的变量也可以使用。当投射语句覆盖了已存在的变量时，只有新的变量可用。

### LIMIT

limit限制输出的行数。limit可接受结果为正整数的任意表达式，但表达式不能引用节点或者关系。

### SKIP

skip定义了从那行开始返回结果。使用skip可以跳过开始的一部分结果。

### WITH

with语句将分段的查询部分连接在一起，查询结果从一部分以管道形式传递给另一部分作为开始点。
使用with可以在将结果传递到后续查询之前对结果进行操作。操作可以是改变结果的形式或者数量。with的一个常见用法就是限制传递给其他match语句的结果数。通过结合order by和limit，可获取排在前面的x个结果。
另一个用法是在聚合值上过滤。with用于在where断言中引入聚合。这些聚合表达式创建了新的结果绑定字段。with也能像return一样对结果使用别名作为绑定名。with还可以用于将图的读数据和更新语句分开，查询中的每一部分要么只是读取，要么都是写入。当部分的语句是基于读语句的结果时，这两者之间的转换必须使用with。

### UNWIND

unwind将一个列表展开为一个行的序列。用unwind可以将任何列表转换为单独的行。这些列表可以参数的形式传入，如前面collect函数的结果或者其他表达式。unwind一个较为常见的用法时创建唯一的列表。另外一个时从提供给查询的参数列表中创建数据。unwind需要给内部值指定新的名字。

### UNION

union语句用于将多个查询结果组合起来。使用union组合查询的结果时，所有查询到的列的名称和数量必须完全一致。使用union all会包含所有结果行，而使用union组合时，会移除结果集中的重复行。

### CALL

call语句用于调用数据库中的过程(Procedure)

```cypher
call dbms.procedures	//查询所有过程
call db.labels	//查询所有标签
call db.propertyKeys	//查询所有属性键
call db.relationshipTypes	//查询所有关系类型
```

### YIELD

yield字句用于显式地选择返回结果集中的那些部分并绑定到一个变量以供后续查询使用

```cypher
call db.labels() yield label return count(label) as numLabels	//查询所有标签数量
call db.propertyKeys() yield propertyKey as prop match (n) where n[prop] is not null return prop,count(n) as numNodes	//查询数据库中包含所有属性键的节点数
```

## 函数

### Predicate(断言函数)

#### all()

判断是否一个断言适用于列表中的所有函数
语法：**all(variable in list where predicate)**
list:返回列表的表达式
variable:用于断言的变量
predicate:用于测试列表中所有元素的断言

```cypher
match p = (a)-[*1..3]->(b) where a.name = 'Alice' and b.name = 'Daniel' and all(x in nodes(p) where x.age > 30) return p	//返回路径中的所有节点都有一个至少大于30的age属性
```

#### any()

判断是否一个断言至少适用于列表中的一个元素
语法：**any(variable in list where predicate)**
list:返回列表的表达式
variable:用于断言的变量
predicate:用于测试列表中所有元素的断言

```cypher
match (a) where a.name = 'Eskill' and any(x in a.array where x = 'one') return a	//返回路径中的所有节点的array数组属性中至少有一个值为'one'
```

#### none()

如果断言不适用于列表中的任何元素，则返回true
语法：**none(variable in list where predicate)**
list:返回列表的表达式
variable:用于断言的变量
predicate:用于测试列表中所有元素的断言

```cypher
match p = (a)-[*1..3]->(b) where a.name = 'Alice' and none(x in nodes(p) where x.age = 25) return p	//返回路径中没有节点的age属性为25
```

#### single()

如果断言刚好只适用于列表中的某一个元素则返回true
语法：**single(variable in list where predicate)**
list:返回列表的表达式
variable:用于断言的变量
predicate:用于测试列表中所有元素的断言

```cypher
match p = (a)-[*1..3]->(b) where a.name = 'Alice' and single(x in nodes(p) where x.eyes = 'blue') return p	//返回路径中刚好只用一个节点的eyes属性为blue
```

#### exists()

如果数据库中存在该模式或者节点中存在该属性时，返回true
语法：**exists(pattern-or-property)**
pattern-or-property:模式或者属性

```cypher
match (n) where exists(n.name) return n.name as name, exists((n)-[:MARRIED]->()) as is_married	//查询所有节点的name属性和指示是否已婚的true/false值
```

### Scalar(标量函数)

#### size()

1. 使用size()返回列表中元素的个数语法：**size(list)**list:返回列表的表达式
2. size的参数不是一个列表而是一个模式匹配到的查询结果集，计算的是结果集元素的个数，而不是表达式本身的长度。语法：**size(pattern expression)**pattern expression:返回列表的模式表达式

#### length()

1. 使用length()返回路径的长度语法：**length(path)**path:返回路径的表达式
2. 返回字符串的长度语法：**length(string)**string:返回字符串的表达式

#### type()

返回字符串代表的关系类型
语法：**type(relationship)**
relationship:一个关系

#### id()

返回节点或者关系的id
语法：**id(property-container)**
property-container:一个节点或者关系

#### coalesce()

返回表达式列表中的第一个非空的值，如果所有的实参都为空，则返回null
语法：**coalesce(expression[,expression]\*)**
expression:表达式，可能返回null

```cypher
match (a) where a.name = 'Alice' return coalesce(a.ahircoler, a.eyes)
```

#### head()

返回列表中的第一个元素
语法：**head(expression)**
expression:返回列表的表达式

#### last()

返回列表中的第一个元素
语法：**last(expression)**
expression:返回列表的表达式

#### timestamp()

返回当前时间与1970-1-1午夜之间的差值，即时间戳
语法：**timestamp()**

#### startNode()

返回一个关系的开始节点
语法：**startNode(relationship)**
relationship:一个关系

#### endNode()

返回一个关系的开始节点
语法：**endNode(relationship)**
relationship:一个关系

#### properties()

将实参转为属性值的map。如果实参是一个节点或者关系，返回的就是节点或者关系的属性的map。如果实参已经是一个map了，则原样返回
语法：**properties(expression)**
expression:返回节点、关系或者map的表达式

#### toInt()

将实参转换为一个整数，字符串会被解析为一个整数，如果解析失败，将返回null，浮点数将被强制转换为整数。
语法：**toInt(expression)**
expression:返回任意值的表达式

#### toFloat()

将实参转换为一个浮点数，字符串会被解析为一个点数，如果解析失败，将返回null，整数将被强制转换为点数。
语法：**toFloat(expression)**
expression:返回任意值的表达式

### List(列表函数)

#### nodes()

返回一条路径中的所有节点
语法：**nodes(path)**
path:一条路径

#### relationships()

返回一条路径中的所有关系
语法：**relationships(path)**
path:一条路径

#### labels()

以字符串列表的形式返回一个节点的所有标签
语法：**labels(node)**
node:返回单个节点的任意表达式

#### keys()

以字符串列表的形式返回一个节点、关系或者map的所有属性的名称
语法：**keys(property-container)**
property-container:一个节点、关系或者字面值的map

#### extract()

从节点或者关系列表中返回单个属性或者某个函数的值，他将遍历整个列表，针对列表中的每一个元素运行一个表达式，然后以列表的形式返回这些结果。他的工作方式类似于Lisp和Scala等函数式语言中的map方法
语法：**extract(variable in list | expression)**
list:返回列表的表达式
variable:引用list中的元素的变量，他在expression中会用到
expression:针对列表中的每一个元素所运行的表达式，并产生一个结果列表。

```cypher
match p = (a)-->(b)-->(c) where a.name = 'Alice' and b.name = 'Daniel' return extract(n in nodes(p) | n.age) as extracted	//返回了路径中所有节点的age属性
```

#### filter()

返回列表中的满足断言要求的所有元素
语法：**filter(variable in list where predicate)**
list:返回列表的表达式
variable:断言中引用列表元素所用到的变量
predicate:针对列表中的每一个元素进行测试的断言

```cypher
match (a) where a.name = 'Eskill' return a.array, filter(x in a.array where size(x) = 3)	//返回array属性，及其元素的字符数为3的元素列表
```

#### tail()

返回列表中除首元素之外的所有元素
语法：**tail(expression)**
expression:返回某个类型列表的表达式

#### range()

返回某个范围之内的数值，值之间的步长默认为1，范围包含起始边界值，即集合为全毕
语法：**range(start,end [,step])**
start:起始数值的表达式
end:结束数值的表达式
step:数值间隔的步长

```cypher
return range(0, 10), range(2, 18, 3)	//第一个返回0到10之间步长为1的所有值，第二个返回从2到18之间的步长为3的所有值。
```

```
结果：
range(0, 10)
[0,1,2,3,4,5,6,7,8,9,10]
range(2, 18, 3)
[2,5,8,11,14,17]
```

#### reduce()

对列表中的每一个元素执行一个表达式，将表达式的结果存入一个累加器。他的工作机制类似Lisp和Scala等函数式语言中的fold或者reduce方法
语法：**reduce(accumulator = initial, variable in list | expression)**
accumulator:用于累加每次迭代的部分结果
initial:累加器的初始值
list:返回列表的表达式
variable:引用列表中的每个元素的变量
expression:针对列表中每个元素执行的表达式

```cypher
match p = (a)-->(b)-->(c) where a.name = 'Alice' and b.name = 'Bob' and c.name = 'Daniel' return reduce(totalAge = 0, n in nodes(p) | totalAge + n.age) as reduction	//将路径中每一个节点的age数值加起来，然后返回一个单值
```

### 数学函数

#### 数值函数

##### abs()

返回数值的绝对值。
语法：**abs(expression)**
expression:数值表达式

##### ceil()

返回大于或者等于实参的最小整数。
语法：**ceil(expression)**
expression:数值表达式

##### floor()

返回小于或者等于表达式的最大整数。
语法：**floor(expression)**
expression:数值表达式

##### round()

返回距离表达式最近的整数。
语法：**round(expression)**
expression:数值表达式

##### sign()

返回一个数值的正负。如果值为0，则返回0；如果值为负数，则返回-1；覆盖值为正数，则返回1
语法：**sign(expression)**
expression:数值表达式

##### rand()

返回`[0, 1)`之间的一个随机数，返回的数值在整个区间遵循均匀分布。
语法：**rand()**

#### 对数函数

##### log()

返回表达式的自然对数
语法：**log(expression)**
expression:数值表达式

##### log10()

返回表达式的自然对数(以10为底)
语法：**log10(expression)**
expression:数值表达式

##### exp()

返回e^n，e是自然对数的底，n是表达式的实参值。
语法：**exp(expression)**
expression:数值表达式

##### e()

返回自然对数的底，即e
语法：**e()**

##### sqrt()

返回数值的平方根
语法：**sqrt(expression)**
expression:数值表达式

#### 三角函数

除非特别指明，所有的三角函数都是针对弧度值进行计算的。

##### sin()

返回表达式的正弦函数值
语法：**sin(expression)**
expression:一个表示角的弧度的数值表达式

##### cos()

返回表达式的余弦函数值
语法：**cos(expression)**
expression:一个表示角的弧度的数值表达式

##### tan()

返回表达式的正切函数值
语法：**tan(expression)**
expression:一个表示角的弧度的数值表达式

##### cot()

返回表达式的余切函数值
语法：**cot(expression)**
expression:一个表示角的弧度的数值表达式

##### asin()

返回表达式的反正弦函数值
语法：**asin(expression)**
expression:一个表示角的弧度的数值表达式

##### acos()

返回表达式的反余弦函数值
语法：**acos(expression)**
expression:一个表示角的弧度的数值表达式

##### atan()

返回表达式的反正切函数值
语法：**atan(expression)**
expression:一个表示角的弧度的数值表达式

##### atan2()

返回方位角，亦可以理解为计算复数x+yi的幅角。
语法：**atan2(expression1, expression2)**
expression1:表示复数x部分的数值表达式
expression2:表示复数y部分的数值表达式

##### pi()

返回常数pi(圆周率Π)的值
语法：**pi()**

##### degrees()

将弧度转为度
语法：**degrees(expression)**
expression:一个表示角的弧度的数值表达式

##### radians()

将度转换为弧度
语法：**radians(expression)**
expression:一个表示角的度数的数值表达式

##### haversin()

返回表达式的半正矢
语法：**haversin(expression)**
expression:一个表示角的弧度的数值表达式

##### 使用haversin函数计算球面距离

haversin函数可用于计算球面上两点(以经纬度方式给出)之间的距离。例如：计算德国柏林(lat 52.5, lon 13.4)和美国加州圣马特奥市(lat 375, lon -122.3)两点之间的球面距离(以km计)。

```cypher
cerate (ber:City{lat:52.5, lon:13.4}),(sm:City{lat:37.5, lon:-122.3}) return 2 * 6371 * asin(sqrt(haversin(radians(sm.lat - ber.lat)) + cos(radians(sm.lat)) * cos(radians(ber.lat)) * haversin(radians(sm.lon - ber.lon)))) as dist	//采用的地球平均半径为6371km,结果为9129.969740051658
```

### 字符串函数

#### replace()

返回被替换字符串替换后的字符串，他会替换所有出现过的字符串。
语法：**replace(original, search, replace)**
original:原字符串
search:期望被替换的字符串
replace:用于替换的字符串

#### substring()

返回原字符串的子串，它带有一个0为开始的索引值和长度作为参数。如果长度省略了，那么他将返回从索引开始到结束的子字符串。
语法：**substring(original, start [,length])**
original:原字符串
start:子串的开始位置
length:子串的长度

#### left()

返回原字符串左边指定长度的子串。
语法：**left(original, length)**
original:原字符串
length:左边子字符串的长度

#### right()

返回原字符串右边指定长度的子串。
语法：**right(original, length)**
original:原字符串
length:右边子字符串的长度

#### ltrim()

返回原字符串移除左边的空白字符后的字符串。
语法：**ltrim(original)**
original:原字符串

#### rtrim()

返回原字符串移除右边的空白字符后的字符串。
语法：**rtrim(original)**
original:原字符串

#### trim()

返回原字符串移除两边的空白字符后的字符串。
语法：**trim(original)**
original:原字符串

#### lower()

以小写的形式返回原字符串。
语法：**lower(original)**
original:原字符串

#### upper()

以大写的形式返回原字符串。
语法：**upper(original)**
original:原字符串

#### split()

返回以指定模式分割后的字符串序列
语法：**split(original, splitPattern)**
original:原字符串
splitPattern:分割字符串

#### reverse()

返回原字符串的倒序字符串
语法：**reverse(original)**
original:原字符串

#### toString()

将实参转换为字符串。他将整形浮点型转换为字符串。如果实参为字符串，则原样返回。
语法：**toString(expression)**
expression:返回数值、布尔或者字符串的表达式

### 自定义函数

自定义函数用Java语言编写，可部署到数据库中，调用方式与其它Cypher函数一样。

#### 调用自定义函数

调用自定义函数org.neo4j.procedure.example.join()

```cypher
match(n:Member) return org.neo4j.function.example.join(collect(n.name))
```

#### 编写自定义函数

自定义函数的编写类似于过程(Procedure)的创建，但它采用@UserFunction注解，并且只返回一个单值。有效的输出类型包括`long、Long、double、Double、booble、Booble、String、Node、Relationship、Path、Map<String, Object>或者List<T>`，这里的T可以是任何支持的类型。
下面是一个简单的自定义函数的例子，该函数将list中的字符串用指定的分割符连接起来。

```java
package example;
import org.neo4j.procedure.Name;
import org.neo4j.procedure.Procedure;
import org.neo4j.procedure.UserFunction;
public class Join {
    @UserFunction
    @Description("example.join(['s1','s2',...], delimiter) - join the given strings whith the given delimiter.")
    public String join(@Name("strings") List<String> strings, @Name(value = "delimiter", defaultValue = ",") String delimiter) {
        if (strings == null || delimiter == null) {
            return null;
        }
        return String.join(delimiter, strings);
    }
}
```

## 模式(Schema)

基于标签的概念，Neo4j 2.0为图引入了可选模式。在索引的规范中的标签为图定义约束。索引和约束是图的模式。Cypher引入了数据定义语言(Data Definition Language, DDL)来操作模式。

### 索引

数据库的索引是为了使得检索数据效率跟高而引入的允余信息。他的代价是需要额外的存储空间和使得写入时变得更慢。因此，决定哪些数据需要建立索引，那些不需要是非常重要的工作。
Cypher允许所有节点上的某个属性上有特定的标签。索引一旦创建，他将自己管理并当图发生变化时自动更新。一旦索引创建并生效之后，neo4j将自动开始使用索引。

#### 创建索引

使用create index on可以在拥有某个标签的所有节点的某个属性上创建索引。索引是在后台创建，并不能立刻生效。

```cypher
create index on :Person(name)	//在拥有Person标签的所有节点的name属性上创建了索引
```

#### 删除索引

使用drop index on可以删除拥有某个标签的所有标签的所有节点的某个属性上的索引。

```cypher
drop index on :Person(name)	//删除拥有Person标签的所有节点的name属性上的索引
```

#### 使用索引

通常不需要在查询中指出使用哪个索引，Cypher自己会决定。如果希望使用指定的索引，可以使用using来提示。

### 约束

Neo4j通过使用约束来保证数据完整性。约束可用于节点或者关系，可以创建节点属性的唯一性约束，也可以创建节点和关系的属性存在性约束。

#### 节点属性的唯一性约束

1. 创建唯一性约束使用is unique语法创建约束，它能确保数据库中拥有特定标签和属性值的节点是唯一的。

```cypher
create constraint on (book:Book) assert book.isbn is unique
```

2. 删除唯一性约束使用drop constraint可以删除数据库中的一个约束。

```cypher
drop constraint on (book:Book) assert book.isbn is unique
```

#### 节点属性的存在性约束

**只有企业版有此功能。**

1. 创建存在性约束使用assert exists(variable.propertyName)创建约束，可确保有指定标签的所有节点都有一个特定的属性

```cypher
create constraint on (book:Book) assert exists(book.isbn)
```

2. 删除存在性约束使用drop constraint可以删除数据库中的一个约束。

```cypher
drop constraint on (book:Book) assert exists(book.isbn)
```

#### 关系属性的存在性约束

**只有企业版有此功能。**

1. 创建存在性约束使用assert exists(variable.propertyName)创建约束，可确保特定类型的所有关系都有一个特定的属性

```cypher
create constraint on ()-[like:LIKED]-() assert exists(like.day)
```

2. 删除存在性约束使用drop constraint可以删除数据库中的一个约束。

```cypher
drop constraint on ()-[like:LIKED]-() assert exists(like.day)
```

### 统计

当执行一个Cypher查询时，它将先编译为一个执行计划，该计划可以运行并响应查询。为了查询的高效性，Neo4j需要统计数据库的信息。
需要统计的信息如下：

- 拥有特定标签的节点的数量
- 每个索引的可选择性
- 按类型分的关系的数量
- 以拥有指定标签的节点开始或者结束的关系，按类型分各自的数量。

当产生执行计划的统计信息发生变化时，缓存的执行计划将被重新生成。下面的配置项可控制执行计划的更新。

- dbms.index_sampling.background_enabled控制当需要更新时索引是否会自动重新采样，Cypher查询计划器依赖于准确的统计信息来创建执行计划，因此当数据库更新时应当保持同步。
- dbms.index_sampling.update_percentage控制多大比例的索引被更新后才触发新的采样
- cypher.statistics_divergence_threshold控制一个执行计划被认为过时并必须重新生成前，允许多少统计信息发生变化。任何统计信息的相对变化超过临界值，原有执行计划将被丢弃并创建一个新的计划。临界值0.0意味着有变化就更新，1.0意味着永远都不更新。索引重采样可使用内嵌的db.resampleIndex()和db.resampleOutdatedIndexes()两个内嵌过程来触发

## 查询调优

手动查询性能优化的总目标是确保只从图中检索必要的数据。不必要的
Cypher 执行引擎会将每个Cypher查询转为一个执行计划。为减少使用的资源，如果可能应尽可能地使用参数代替字面值。这会使得Cypher可以重用查询，而不必解析构建一个新的执行计划。

### 查询如何执行

每个查询都被查询计划器转化为一个执行计划。在执行查询时，执行计划将告知Neo4j执行什么样的操作。
规则：查询计划器有用于产生查询计划的规则。他会考虑所有可用的索引，但不使用统计信息去指导查询编译
成本：计划器使用统计服务为所有可选的查询赋予一个成本，然后选耗费最少的那个，这在大多数的情况下会得到更优的查询计划，但这个功能还在开发中。

### 查询性能分析

查看执行计划对查询进行分析时有两个选项

1. EXPLAN只查看查询计划不执行该语句，需在查询语句中加入EXPLAN
2. PROFILE运行查询语句并查看那个运算符占了大部分的工作，可在查询语句中加入PROFILE，语句被执行并跟踪传递了多少行数据给每个运算符，一个每个运算符与存储层交互了多少以获取必要的数据。加入PROFILE将占用更多的资源。

### USING

USING语句用于为一个查询构建执行计划时影响计划器的决定。通过USING来强制neo4j使用一个特定的开始点叫做计划器提示。

#### 索引提示

索引提示用于告知计划器无论在什么情况下都应使用指定的索引作为开始点。使用在MATCH语句之后添加USING INDEX variable:Label(property)来补充索引提示。例如

```cypher
MATCH (liskov:Scientist { name:'Liskov' })-[:KNOWS]->(wing:Scientist)-[:RESEARCHED]->(cs:Science {name:'Computer Science'})<-[:RESEARCHED]-(conway:Scientist {name:'conway'}) USING INDEX liskov:Scientist(name) RETURN liskov.born AS column
```

提供一个索引提示会改变查询的开始点，但查询计划依然是线性的，因为只有一个开始点。如果为计划器提供另外一个索引提示，强制使用两个开始点，匹配的两端各一个。这时将使用join运算符来连接两个分支。例如

```cypher
MATCH (liskov:Scientist { name:'Liskov' })-[:KNOWS]->(wing:Scientist)-[:RESEARCHED]->(cs:Science {name:'Computer Science'})<-[:RESEARCHED]-(conway:Scientist {name:'conway'}) USING INDEX liskov:Scientist(name) USING INDEX conway:Scientist(name) RETURN liskov.born AS column
```

#### 扫描提示

如果查询匹配到一个索引的大部分，它可以更快地扫描标签并过滤掉不匹配地节点。通过在MATCH语句后面使用USING SCAN variable:Label可以做到这一点。他将强制Cypher不使用本应该使用地索引，而采用标签扫描。例如

```cypher
MATCH (s:Scientist) USING SCAN s:Scientist WHERE s.born < 1939 REURUN s.born as colum
```

#### 连接(Join)提示

连接提示是强制在特定地点进行连接。

1. 提示在单个节点上地连接

```cypher
MATCH (liskov:Scientist { name:'Liskov' })-[:KNOWS]->(wing:Scientist)-[:RESEARCHED]->(cs:Science {name:'Computer Science'})<-[:RESEARCHED]-(conway:Scientist {name:'conway'})
USING INDEX liskov:Scientist(name)
USING INDEX conway:Scientist(name)
USING JOIN ON wing
RETURN liskov.born AS column	//强制在wing上连接而不是使用连接提示
```

2. 提示在多个节点上地连接

```cypher
MATCH (liskov:Scientist { name:'Liskov' })-[:KNOWS]->(wing:Scientist)-[:RESEARCHED]->(cs:Science {name:'Computer Science'})<-[:RESEARCHED]-(conway:Scientist {name:'conway'})
USING INDEX liskov:Scientist(name)
USING JOIN ON liskov,cs
RETURN liskov.born AS column	//在多个指定的节点上产生一个连接，要求查询从同一个节点的多个方向展开
```

## 执行计划

Neo4j将执行一个查询的任务分解为一些被称为运算符的小块，每个运算符负责整个查询中的一小部分。这些以模式形式连接在一起的运算符被称为一个执行计划。
Rows:Row运算符产生的行数，只有带有profile的查询才有。
EstimatedRows:如果neo4j使用基于成本的编译器，可以看到由运算符所产生的预估的行数，编译器使用这个估值来选择合适的执行计划。
DbHits:每个运算符都会向Neo4j存储引擎请求检索或者更新数据这样的操作。一个数据库命中是存储引擎工作的一个抽象单位。

### 开始点运算符

用于找到图的开始点

#### 全节点扫描

从节点库中扫描所有节点。实参中的变量将包含所有的节点，如果查询中使用这个运算符，在任何大点的数据库中就会遭遇性能问题。

```cypher
MATCH (n) RETURN n
```

#### 通过id搜索有向关系

从关系库中通过id来读取一个或者多个关系将返回关系和两端的节点

```cypher
MATCH (n1)-[r]->() WHERE id(r) = 0 RETURN r, n1
```

#### 通过id寻找节点

从节点库中通过id读取一个或者多个节点

```cypher
MATCH (n) WHERE id(n) = 0 RETURN n
```

#### 通过标签扫描检索节点

使用标签索引，从节点的标签索引中获取拥有指定标签的所有节点。

```cypher
MATCH (person:Person) RETURN person
```

#### 通过索引检索节点

使用索引搜索节点，节点变量和使用的索引在运算符的实参中，如果索引是一个唯一性索引，运算符将由一个被称为NodeUniqueIndexSeek的代替。

```cypher
MATCH (person:Person{name:'Tom'}) RETURN person
```

#### 通过索引范围寻找节点

使用索引检索节点，节点的属性值满足给定的字符串前缀。这个运算符可用于STARTS WITH 和比较符号，如<、>和>=。

### Expand运算符

### 组合运算符

### 行运算符

### 更新运算符

### 最短路径规划
