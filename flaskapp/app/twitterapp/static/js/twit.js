var twit = angular.module("twit",[]);

twit.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }
);

twit.controller('SubmitUserCtrl', function($scope,$http){ 
	$scope.user = ""
	$scope.tweetList = {};
	$scope.sentimentData = [];



	$scope.getSentiment = function(text){
		var api = "http://access.alchemyapi.com/calls/text/TextGetTextSentiment?apikey=";
		//var apiKey = "9af74486091d231db123300feef3d4543889df7e&";
		var apiKey = "946874135cd34ad1f2740f28bc299d3f0ebf9556&"
		api = api + apiKey + "&text=" + encodeURI(text) + "&outputMode=json&jsonp=JSON_CALLBACK";
		var returnValue = {};

		$http({method:'JSONP', url: api})
		.success(function(data,status){
			var data2 = {tweet:text, data: data.docSentiment}
			$scope.sentimentData.push(data2);
		})
		.error(function(data,status){
			console.log(data || "FAILED");
		});


	}


	$scope.submit = function(){
		var postData = {user:$scope.user}
		$http.post('/post/mzb',postData)
		.success(function(data,status,headers,config){
			$scope.tweetList = data;
			console.log($scope.tweetList)

			for(var i = 0;i<data.length;i++){
				$scope.getSentiment(data[i]);
			}
		});




		// $http({method: 'GET', url: '/getTweets'}).
		// success(function(data, status, headers, config) {
		// 	$scope.tweetList = data;
		// 	console.log(data)
		// }).
		// error(function(data, status, headers, config) {
		// 	$scope.log("error bitch")
		// });
	}

});



