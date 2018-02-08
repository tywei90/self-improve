define(function(require) {
	var sortArrMethods = {
		/*
		 * Flatten javascript objects into a single-depth object
		 * Object Flatten <https://gist.github.com/penguinboy/762197>
		 */
		flattenObject: function(ob) {
			var toReturn = {};
			for (var i in ob) {
				if (!ob.hasOwnProperty(i)) continue;
				if ((typeof ob[i]) == 'object') {
					var flatObject = this.flattenObject(ob[i]);
					for (var x in flatObject) {
						if (!flatObject.hasOwnProperty(x)) continue;
						toReturn[i + '.' + x] = flatObject[x];
					}
				} else {
					toReturn[i] = ob[i];
				}
			}
			return toReturn;
		},

		// select matched value
		selData: function(arr, asc) {
			var sortFn;
			if(typeof asc === 'function'){
				sortFn = asc;
			}else{
				sortFn = function(a, b){
					if(asc === false){
						if(typeof a === 'string'){
							return b.localeCompare(a)
						}
						if(typeof a === 'number'){
							return b - a
						}
						return 0
					}else{
						if(typeof a === 'string'){
							return a.localeCompare(b)
						}
						if(typeof a === 'number'){
							return a - b
						}
						return 0
					}
				}
			}
			arr.sort(sortFn);
			return arr[0]
		},

		// select array whose attribute matches
		selObjArr: function(arr, attr, asc) {
			var optData;
			var tmpArr = [];
			var outArr = [];
			if(attr === undefined || arr.length === 0){
				return [];
			}
			if(typeof attr !== "string"){
				throw new TypeError('PARAM MUST BE STRING');
			}
			for(var i=0,len=arr.length; i<len; i++){
				tmpArr.push(this.flattenObject(arr[i])[attr]);
			}
			optData = this.selData(tmpArr, asc);
			for(var i=0,len=arr.length; i<len; i++){
				if (this.flattenObject(arr[i])[attr] === optData) {
					outArr.push(arr[i]);
				}
			}
			return outArr
		},

		// delete array elements by index array
		del: function(arr, indexArr) {
			// check params
			if(indexArr === undefined){
				return arr
			}
			if(Object.prototype.toString.call(indexArr) !== "[object Array]"){
				throw new TypeError('PARAM MUST BE ARRAY');
			}
			for(var i=0, len=indexArr.length; i < len; i++){
				if(typeof indexArr[i] !== "number"){
					throw new TypeError('PARAM MUST BE NUMBER ARRAY');
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
			// should not change the value of input arr
			var outArr = JSON.parse(JSON.stringify(arr));
			if (arr.length === 0) {
				return [];
			}
			for (var i = 0, len = tmpArr.length; i < len; i++) {
				outArr.splice(tmpArr[i] - i, 1);
			}
			return outArr
		},

		// sort array by multiple conditions
		sort: function(arr, sortLists) {
			if(sortLists === undefined){
				return arr;
			}
			if(Object.prototype.toString.call(sortLists) !== "[object Array]"){
				throw new TypeError('PARAM MUST BE ARRAY');
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
			var sortArrOuter = (function sortArrWrap(arr, sortList) {
				if(Object.prototype.toString.call(sortList) !== "[object Object]"){
					throw new TypeError('PARAM MUST BE OBJECT ARRAY');
				}
				var filterArr = [];
				if (arr.length === 0) {
					return;
				}
				filterArr = me.selObjArr(arr, sortList.attr || '', sortList.asc);
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
							inArr = me.del(inArr, [delIndex]);
						}
					}
				} else {
					i++;
					sortArrWrap(filterArr, sortLists[i])
				}
			})
			var loopSortArr = (function loopSortArrWrap() {
				i = 0;
				sortArrOuter(inArr, sortLists[0]);
				if (inArr.length === 0) {
					return
				}
				loopSortArrWrap();
			})
			loopSortArr();
			return outArr;
		}
	}
	return sortArrMethods
})
