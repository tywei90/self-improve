define(function(require) {
	var sortArrMethods ={
		// delete array elements by index array
		delByIndexArr: function(arr, indexArr) {
			// check params
			if(indexArr === undefined){
				return arr
			}
			if(Object.prototype.toString.call(arr) !== "[object Array]"){
				throw new Error('FIRST PARAM MUST BE ARRAY');
			}
			if(Object.prototype.toString.call(indexArr) !== "[object Array]"){
				throw new Error('SECOND PARAM MUST BE ARRAY');
			}
			for(var i=0, len=indexArr.length; i < len; i++){
				if(typeof indexArr[i] !== "number"){
					throw new Error('THE ELEMENT OF SECOND PARAM MUST BE NUMBER');
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
			// should not change the value of arr
			var outArr = JSON.parse(JSON.stringify(arr));
			if (arr.length === 0) {
				return [];
			}
			for (var i = 0, len = tmpArr.length; i < len; i++) {
				outArr.splice(tmpArr[i] - i, 1);
			}
			return outArr
		},

		// get array whose attribute has the min value
		minObjArr: function(arr, sortType) {
			if(sortType === undefined){
				return [];
			}
			if(Object.prototype.toString.call(arr) !== "[object Array]"){
				throw new Error('FIRST PARAM MUST BE ARRAY');
			}
			if(typeof sortType !== "string"){
				throw new Error('SECOND PARAM MUST BE STRING');
			}
			var minData;
			var tmpArr = [];
			var outArr = [];
			if (arr.length === 0) {
				return [];
			}
			for(var i=0,len=arr.length; i<len; i++){
				tmpArr.push(arr[i][sortType]);
			}
			minData = minNum(tmpArr);
			for(var i=0,len=arr.length; i<len; i++){
				if (arr[i][sortType] === minData) {
					outArr.push(arr[i]);
				}
			}
			return outArr
			// select the min value of number array
			function minNum(array) {
				return Math.min.apply({}, array)
			}
		},

		// get array whose attribute has the max value
		maxObjArr: function(arr, sortType) {
			if(sortType === undefined){
				return [];
			}
			if(Object.prototype.toString.call(arr) !== "[object Array]"){
				throw new Error('FIRST PARAM MUST BE ARRAY');
			}
			if(typeof sortType !== "string"){
				throw new Error('SECOND PARAM MUST BE STRING');
			}
			var maxData;
			var tmpArr = [];
			var outArr = [];
			if (arr.length === 0) {
				return [];
			}
			for(var i=0,len=arr.length; i<len; i++){
				tmpArr.push(arr[i][sortType]);
			}
			maxData = maxNum(tmpArr);
			for(var i=0,len=arr.length; i<len; i++){
				if (arr[i][sortType] === maxData) {
					outArr.push(arr[i]);
				}
			}
			return outArr
			// select the min value of number array
			function maxNum(array) {
				return Math.max.apply({}, array)
			}
		},

		// sort array by multiple conditions
		multiSortArr: function(arr, sortLists) {
			if(sortLists === undefined){
				return arr;
			}
			if(Object.prototype.toString.call(arr) !== "[object Array]"){
				throw new Error('FIRST PARAM MUST BE ARRAY');
			}
			if(Object.prototype.toString.call(sortLists) !== "[object Array]"){
				throw new Error('SECOND PARAM MUST BE ARRAY');
			}
			var i = 0;
			var me = this;
			var len = sortLists.length;
			var inArr = JSON.parse(JSON.stringify(arr));
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
						throw new Error('THE ELEMENT OF SECOND PARAM MUST BE OBJECT');
					}
					var filterArr = [];
					if (arr.length === 0) {
						return;
					}
					if (sortList.ascend === false) {
						filterArr = me.maxObjArr(arr, sortList.attr || '');
					} else {
						filterArr = me.minObjArr(arr, sortList.attr || '');
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
								inArr = me.delByIndexArr(inArr, [delIndex]);
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
	};
	return sortArrMethods
})
