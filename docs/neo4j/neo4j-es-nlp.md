---
title: Neo4j Elasticsearch NLP
layout: doc
outline: deep
---

# Neo4j Elasticsearch NLP

## GraphAware Neo4j Elasticsearch

[![GitHub](https://img.shields.io/badge/GitHub--yellow.svg?style=social&logo=github)](https://github.com/graphaware/neo4j-to-elasticsearch)

```
neo4j-to-elasticsear是chNeo4j和Elasticsearch集成的插件
GraphAware Elasticsearch Integration是Neo4j和Elasticsearch之间的企业级双向集成。它由两个独立的模块和一个测试套件组成。两个模块可以单独使用或一起使用，以实现完全集成。

第一个模块（该项目）是Neo4j的插件（更准确地说，是GraphAware事务驱动的运行时模块），可以配置为透明地并且异步地将数据从Neo4j复制到Elasticsearch。该模块现已投入生产，并由GraphAware for GraphAware Enterprise订户正式支持 。

在第二个模块（又名图形辅助搜索）是一个插件，Elasticsearch能的Elasticsearch查询，以丰富的结果在咨询的Neo4j数据库（提高分数）通过在图形数据库更有效的计算结果，如建议
<dependency>
        <groupId>com.graphaware.integration.es</groupId>
        <!-- this will be com.graphaware.neo4j in the next release -->
        <artifactId>neo4j-to-elasticsearch</artifactId>
        <version>3.5.1.53.11</version>
    </dependency>
```

## neo4j-nlp-stanfordnlp

[![GitHub](https://img.shields.io/badge/GitHub--yellow.svg?style=social&logo=github)](https://github.com/graphaware/neo4j-nlp-stanfordnlp)

```
GraphAware NLP使用StanfordNLP
斯坦福NLP库提供处理自然语言文本的基本功能：句子分段，标记化，词形还原，部分语法标记，命名实体识别，分块，解析和情感分析。它是通过扩展一般的GraphAware NLP包来实现的。TextProcessor可以显式设置为Stanford NLP，但它不是必需的，因为它当前是默认选项。
```

## Stanford CoreNLP

[![GitHub](https://img.shields.io/badge/GitHub--yellow.svg?style=social&logo=github)](https://github.com/stanfordnlp/CoreNLP)

```
Stanford CoreNLP提供了一套用Java编写的自然语言分析工具。它可以采用原始的人类语言文本输入，并提供单词的基本形式，它们的词性，它们是公司名称，人物等，标准化和解释日期，时间和数字量，标记句子的结构在短语或单词依赖性方面，并指出哪些名词短语指的是相同的实体。它最初是为英语开发的，但现在也为（现代标准）阿拉伯语，（大陆）中文斯坦福CoreNLP是一个集成框架，可以很容易地将一堆语言分析工具应用于一段文本。从纯文本开始，您只需使用两行代码即可运行，法语，德语和西班牙语提供不同程度的支持。所有工具。其分析为更高级别和特定领域的文本理解应用程序提供了基础构建块。斯坦福CoreNLP是一套稳定且经过良好测试的自然语言处理工具，广泛应用于学术界，工业界和政府部门。这些工具以各种方式使用基于规则的概 机器学习和深度学习组件。

Stanford CoreNLP代码是用Java编写的，并根据GNU通用公共许可证（v3或更高版本）进行许可。请注意，这是完整的GPL，允许许多免费使用，但不能用于您分发给他人的专有软件。
```

## HanLP

[![GitHub](https://img.shields.io/badge/GitHub--yellow.svg?style=social&logo=github)](https://github.com/hankcs/HanLP)

HanLP是一系列模型与算法组成的NLP工具包，由大快搜索主导并完全开源，目标是普及自然语言处理在生产环境中的应用。HanLP具备功能完善、性能高效、架构清晰、语料时新、可自定义的特点。

HanLP提供下列功能：

- 中文分词
  - HMM-Bigram（速度与精度最佳平衡；一百兆内存）
    - [最短路分词](https://github.com/hankcs/HanLP#1-第一个demo)、[N-最短路分词](https://github.com/hankcs/HanLP#5-n-最短路径分词)
  - 由字构词（侧重精度，全世界最大语料库，可识别新词；适合NLP任务）
    - [感知机分词](https://github.com/hankcs/HanLP/wiki/结构化感知机标注框架)、[CRF分词](https://github.com/hankcs/HanLP#6-crf分词)
  - 词典分词（侧重速度，每秒数千万字符；省内存）
    - [极速词典分词](https://github.com/hankcs/HanLP#7-极速词典分词)
  - 所有分词器都支持：
    - [索引全切分模式](https://github.com/hankcs/HanLP#4-索引分词)
    - [用户自定义词典](https://github.com/hankcs/HanLP#8-用户自定义词典)
    - [兼容繁体中文](https://github.com/hankcs/HanLP/blob/master/src/test/java/com/hankcs/demo/DemoPerceptronLexicalAnalyzer.java#L29)
    - [训练用户自己的领域模型](https://github.com/hankcs/HanLP/wiki)
- 词性标注
  - [HMM词性标注](https://github.com/hankcs/HanLP/blob/master/src/main/java/com/hankcs/hanlp/seg/Segment.java#L584)（速度快）
  - [感知机词性标注](https://github.com/hankcs/HanLP/wiki/结构化感知机标注框架)、[CRF词性标注](https://github.com/hankcs/HanLP/wiki/CRF词法分析)（精度高）
- 命名实体识别
  - 基于HMM角色标注的命名实体识别 （速度快）
    - [中国人名识别](https://github.com/hankcs/HanLP#9-中国人名识别)、[音译人名识别](https://github.com/hankcs/HanLP#10-音译人名识别)、[日本人名识别](https://github.com/hankcs/HanLP#11-日本人名识别)、[地名识别](https://github.com/hankcs/HanLP#12-地名识别)、[实体机构名识别](https://github.com/hankcs/HanLP#13-机构名识别)
  - 基于线性模型的命名实体识别（精度高）
    - [感知机命名实体识别](https://github.com/hankcs/HanLP/wiki/结构化感知机标注框架)、[CRF命名实体识别](https://github.com/hankcs/HanLP/wiki/CRF词法分析)
- 关键词提取
  - [TextRank关键词提取](https://github.com/hankcs/HanLP#14-关键词提取)
- 自动摘要
  - [TextRank自动摘要](https://github.com/hankcs/HanLP#15-自动摘要)
- 短语提取
  - [基于互信息和左右信息熵的短语提取](https://github.com/hankcs/HanLP#16-短语提取)
- 拼音转换
  - 多音字、声母、韵母、声调
- 简繁转换
  - 简繁分歧词（简体、繁体、臺灣正體、香港繁體）
- 文本推荐
  - 语义推荐、拼音推荐、字词推荐
- 依存句法分析
  - [基于神经网络的高性能依存句法分析器](https://github.com/hankcs/HanLP#21-依存句法分析)
  - [基于ArcEager转移系统的柱搜索依存句法分析器](https://github.com/hankcs/HanLP/blob/master/src/test/java/com/hankcs/demo/DemoDependencyParser.java#L34)
- 文本分类
  - [情感分析](https://github.com/hankcs/HanLP/wiki/文本分类与情感分析#情感分析)
- 文本聚类
  - KMeans、Repeated Bisection、自动推断聚类数目k
- word2vec
  - 词向量训练、加载、词语相似度计算、语义运算、查询、KMeans聚类
  - 文档语义相似度计算
- 语料库工具
  - 部分默认模型训练自小型语料库，鼓励用户自行训练。所有模块提供[训练接口](https://github.com/hankcs/HanLP/wiki)，语料可参考[98年人民日报语料库](http://file.hankcs.com/corpus/pku98.zip)。

在提供丰富功能的同时，HanLP内部模块坚持低耦合、模型坚持惰性加载、服务坚持静态提供、词典坚持明文发布，使用非常方便。默认模型训练自全世界最大规模的中文语料库，同时自带一些语料处理工具，帮助用户训练自己的模型。

## Word

[![GitHub](https://img.shields.io/badge/GitHub--yellow.svg?style=social&logo=github)](https://github.com/ysc/word)

```
word分词是一个Java实现的分布式的中文分词组件，提供了多种基于词典的分词算法，并利用ngram模型来消除歧义。能准确识别英文、数字，以及日期、时间等数量词，能识别人名、地名、组织机构名等未登录词。能通过自定义配置文件来改变组件行为，能自定义用户词库、自动检测词库变化、支持大规模分布式环境，能灵活指定多种分词算法，能使用refine功能灵活控制分词结果，还能使用词频统计、词性标注、同义标注、反义标注、拼音标注等功能。提供了10种分词算法，还提供了10种文本相似度算法，同时还无缝和Lucene、Solr、ElasticSearch、Luke集成。注意：word1.3需要JDK1.8
```
