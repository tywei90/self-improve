// delete array elements by index array
Array.prototype.delByIndexArr = function(indexArr) {
	// check params
	if(indexArr === undefined){
		return this
	}
	if(Object.prototype.toString.call(indexArr) !== "[object Array]"){
		throw new Error('PARAM MUST BE ARRAY');
	}
	for(var i=0, len=indexArr.length; i < len; i++){
		if(typeof indexArr[i] !== "number"){
			throw new Error('THE ELEMENT OF PARAM ARRAY MUST BE NUMBER');
		}
		if(indexArr[i] < -indexArr.length){
			indexArr[i] = 0;
		}
		if(indexArr[i] >= -indexArr.length && indexArr[i] < 0){
			indexArr[i] = indexArr[i] + indexArr.length;
		}
	}
	// first sort indexArr, then remove redupliction
	indexArr.sort(function(a, b){
		return a - b
	})
	var tmpArr = [];
	for(var i=0, len=indexArr.length; i < len; i++){
		if(tmpArr.indexOf(indexArr[i]) == -1){
			tmpArr.push(indexArr[i])
		}
	}
	// should not change the value of 'this'
	var outArr = JSON.parse(JSON.stringify(this));
	if (this.length === 0) {
		return [];
	}
	for (var i = 0, len = tmpArr.length; i < len; i++) {
		outArr.splice(tmpArr[i] - i, 1);
	}
	return outArr
}

// get array whose attribute has the min value
Array.prototype.minObjArr = function(sortType) {
	var minData;
	var tmpArr = [];
	var outArr = [];
	if(sortType === undefined || this.length === 0){
		return [];
	}
	if(typeof sortType !== "string"){
		throw new Error('PARAM MUST BE STRING');
	}
	for(var i=0,len=this.length; i<len; i++){
		tmpArr.push(this[i][sortType]);
	}
	minData = minNum(tmpArr);
	for(var i=0,len=this.length; i<len; i++){
		if (this[i][sortType] === minData) {
			outArr.push(this[i]);
		}
	}
	return outArr
	// select the min value of number array
	function minNum(array) {
		return Math.min.apply({}, array)
	}
}

// get array whose attribute has the max value
Array.prototype.maxObjArr = function(sortType) {
	var maxData;
	var tmpArr = [];
	var outArr = [];
	if(sortType === undefined || this.length === 0){
		return [];
	}
	if(typeof sortType !== "string"){
		throw new Error('PARAM MUST BE STRING');
	}
	for(var i=0,len=this.length; i<len; i++){
		tmpArr.push(this[i][sortType]);
	}
	maxData = maxNum(tmpArr);
	for(var i=0,len=this.length; i<len; i++){
		if (this[i][sortType] === maxData) {
			outArr.push(this[i]);
		}
	}
	return outArr
	// select the min value of number array
	function maxNum(array) {
		return Math.max.apply({}, array)
	}
}

// sort array by multiple conditions
Array.prototype.multiSortArr = function(sortLists) {
	if(sortLists === undefined){
		return this;
	}
	if(Object.prototype.toString.call(sortLists) !== "[object Array]"){
		throw new Error('PARAM MUST BE ARRAY');
	}
	var i = 0;
	var len = sortLists.length;
	var inArr = JSON.parse(JSON.stringify(this));
	var outArr = [];
	if (inArr.length === 0) {
		return [];
	}
	if(len === 0){
		return inArr;
	}
	// the right method to use arguments.callee in strict mode
	var sortArr = (function sortArrWrap(arr, sortList) {
			if(Object.prototype.toString.call(sortList) !== "[object Object]"){
				throw new Error('THE ELEMENT OF PARAM ARRAY MUST BE OBJECT');
			}
			var filterArr = [];
			if (arr.length === 0) {
				return;
			}
			if (sortList.ascend === false) {
				filterArr = arr.maxObjArr(sortList.attr || '');
			} else {
				filterArr = arr.minObjArr(sortList.attr || '');
			}
			if(filterArr.length === 0){
				filterArr = arr;
			}
			if (filterArr.length === 1 || i >= len - 1) {
				outArr = outArr.concat(filterArr);
				// delete the corresponding original array element
				for(var k=0,len1=filterArr.length; k<len1; k++){
					// update stringifyInArr in case same elemets cause error deletion
					var stringifyInArr = [];
					for(var j=0,len2=inArr.length; j<len2; j++){
						stringifyInArr.push(JSON.stringify(inArr[j]));
					}
					var delIndex = stringifyInArr.indexOf(JSON.stringify(filterArr[k]));
					if (delIndex !== -1) {
						inArr = inArr.delByIndexArr([delIndex]);
					}
				}
			} else {
				i++;
				sortArrWrap(filterArr, sortLists[i])
			}
		})
	var loopSortArr = (function loopSortArrWrap() {
		i = 0;
		sortArr(inArr, sortLists[0]);
		if (inArr.length === 0) {
			return
		}
		loopSortArrWrap();
	})
	loopSortArr();
	return outArr;
}
