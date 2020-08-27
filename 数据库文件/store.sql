-- MySQL dump 10.13  Distrib 5.7.11, for Win64 (x86_64)
--
-- Host: localhost    Database: store
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `specifications` varchar(200) DEFAULT NULL,
  `swiper` varchar(100) DEFAULT NULL,
  `detailed` varchar(150) DEFAULT NULL,
  `text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (12,'中国T-34中型坦克','/images/icon_china_mt_t34.png','[{\"name\":\"涂装\",\"item\":[{\"name\":\"坦克出厂原漆\"},{\"name\":\"现代数码迷彩\"}]},{\"name\":\"发动机\",\"item\":[{\"name\":\"坦克出厂发动机\"},{\"name\":\"高级柴油发动机\"}]}]','[\"/images/swiper_china_mt_t34.png\"]','{\"guojia\":\"中国\",\"leixing\":\"中型坦克\",\"jibie\":\"5\",\"houdu\":\"52\",\"sudu\":\"55\",\"koujing\":\"57\",\"chuanshen\":\"189\"}','1950年代，苏联向中国交付中国订购的T-34-85坦克时，曾交付了一批T-34-76坦克，这批坦克被中国转赠给了朝鲜。1960年代，中国坦克设计人员帮助朝鲜对这批坦克进行了改进，升级了发动机和行走系统。'),(13,'58式中型坦克','/images/icon_china_mt_58.png','[{\"name\":\"套餐\",\"item\":[{\"name\":\"原装发动机+100MM主炮\"},{\"name\":\"高级发动机+100MM主炮\"}]}]','[\"/images/swiper_china_mt_58.png\"]','{\"guojia\":\"中国\",\"leixing\":\"中型坦克\",\"jibie\":\"6\",\"houdu\":\"90\",\"sudu\":\"55\",\"koujing\":\"85\",\"chuanshen\":\"172\"}','1954年中国决定仿制生产T-34-85坦克，并计划1958年投产，所以将其命名为58式中型坦克。中国版的T-34-85和苏联原版的存在着一些差异，主要集中在炮塔和行走部分。'),(14,'59式中型坦克','/images/icon_china_mt_59.png','[{\"name\":\"涂装\",\"item\":[{\"name\":\"出厂原漆\"},{\"name\":\"现代数码迷彩\"}]},{\"name\":\"发动机\",\"item\":[{\"name\":\"出厂发动机\"},{\"name\":\"高级柴油发动机\"}]},{\"name\":\"火炮\",\"item\":[{\"name\":\"88MM炮\"},{\"name\":\"100MM炮\"}]}]','[\"/images/swiper_china_mt_59.png\"]','{\"guojia\":\"中国\",\"leixing\":\"中型坦克\",\"jibie\":\"8\",\"houdu\":\"200\",\"sudu\":\"56\",\"koujing\":\"100\",\"chuanshen\":\"241\"}','1957年晚些时候，中国包头坦克工厂生产的T-54坦克的仿制型。截止1987年一共生产6000多辆。1956年购买T-54A全套图纸技术资料和坦克生产工厂，58年11月5日617厂第1辆组装车下线。59年提高国产化率，首批33辆中的32辆参加国庆阅兵。59年底设计定型，63年3月18日生产定型。59式中型坦克累计生产1万余辆。'),(15,'E-100坦克歼击车','/images/icon_germany_td_e100td.png',NULL,'[\"/images/swiper_germany_td_e100td.png\"]','{\"guojia\":\"德国\",\"leixing\":\"坦克歼击车\",\"jibie\":\"10\",\"houdu\":\"200\",\"sudu\":\"30\",\"koujing\":\"170\",\"chuanshen\":\"420\"}','以E-100重型坦克为底盘，设计的一种坦克歼击车。这种坦克歼击车只是E-100系列的一个组成部分，E-100重型坦克车族相当庞大，由重型坦克、自行榴弹炮、自行高炮、坦克歼击车等组成。');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_order`
--

DROP TABLE IF EXISTS `product_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_time` bigint(20) DEFAULT NULL,
  `product_list` varchar(500) NOT NULL,
  `price` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_order`
--

LOCK TABLES `product_order` WRITE;
/*!40000 ALTER TABLE `product_order` DISABLE KEYS */;
INSERT INTO `product_order` VALUES (1,1,1596613577666,'[{\"productId\":12,\"productName\":\"中国T-34中型坦克\",\"icon\":\"/images/icon_china_mt_t34.png\",\"selectValueArr\":[\"坦克出厂原漆\",\"坦克出厂发动机\"],\"specId\":5,\"price\":5000,\"number\":2,\"selected\":true},{\"productId\":13,\"productName\":\"58式中型坦克\",\"icon\":\"/images/icon_china_mt_58.png\",\"selectValueArr\":[\"原装发动机+100MM主炮\"],\"specId\":9,\"price\":5999,\"number\":2,\"selected\":true}]',21998,2),(2,1,1596618419479,'[{\"productId\":12,\"productName\":\"中国T-34中型坦克\",\"icon\":\"/images/icon_china_mt_t34.png\",\"selectValueArr\":[\"坦克出厂原漆\",\"坦克出厂发动机\"],\"specId\":5,\"price\":5000,\"number\":2,\"selected\":true},{\"productId\":13,\"productName\":\"58式中型坦克\",\"icon\":\"/images/icon_china_mt_58.png\",\"selectValueArr\":[\"原装发动机+100MM主炮\"],\"specId\":9,\"price\":5999,\"number\":2,\"selected\":true}]',21998,1);
/*!40000 ALTER TABLE `product_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specifications`
--

DROP TABLE IF EXISTS `specifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `specifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specifications`
--

LOCK TABLES `specifications` WRITE;
/*!40000 ALTER TABLE `specifications` DISABLE KEYS */;
INSERT INTO `specifications` VALUES (5,12,'坦克出厂原漆,坦克出厂发动机',5000,5),(6,12,'坦克出厂原漆,高级柴油发动机',6000,6),(7,12,'现代数码迷彩,坦克出厂发动机',6000,4),(8,12,'现代数码迷彩,高级柴油发动机',0,0),(9,13,'原装发动机+100MM主炮',5999,10),(10,13,'高级发动机+100MM主炮',6999,2),(19,14,'出厂原漆,出厂发动机,88MM炮',6000,5),(20,14,'出厂原漆,出厂发动机,100MM炮',6500,5),(21,14,'出厂原漆,高级柴油发动机,88MM炮',6500,5),(22,14,'出厂原漆,高级柴油发动机,100MM炮',6999,5),(23,14,'现代数码迷彩,出厂发动机,88MM炮',6500,5),(24,14,'现代数码迷彩,出厂发动机,100MM炮',7000,1),(25,14,'现代数码迷彩,高级柴油发动机,88MM炮',8000,0),(26,14,'现代数码迷彩,高级柴油发动机,100MM炮',9000,0);
/*!40000 ALTER TABLE `specifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'123456','123456');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-27  9:01:31
