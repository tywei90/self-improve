<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<title>slider</title>
<link rel="stylesheet/less" href="./main.less">
<script src="../.lib/less-2.5.3.min.js"></script>
</head>

<body>
	<div class="m-slider">
		<div class="inner f-cb">
			<div @click="selectProd($index)" v-for="product in products" :class="['ball f-fl', productIndex===$index ? 'current':'']"><div class="inner-ball"><span>{{product.productName}}</span></div></div>
		</div>
	</div>
</body>
</html>