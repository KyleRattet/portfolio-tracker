app.controller('MainController', ['$scope', '$http', 'httpFactory' , function($scope, $http, httpFactory) {

  // $scope.portfolio = [];


  //quote controller (renders trade ticket)
  $scope.tradeForm = function () {
    $scope.trade = true;
  };

   //get stock from portfolio, api call to my database
  // getStocks = function (url) {
  //   httpFactory.get(url)
  //   .then(function(response){
  //     $scope.portfolio = response.data;
  //   });
  // };

  // getStocks('api/v1/stocks');


  // $scope.initialValue = function() {
  //   var total = 0;
  //   for (var i = 0; i < $scope.portfolio.length; i++) {
  //     var stock = $scope.portfolio[i];
  //     total += (stock.costBasis * stock.shares);
  //   }
  //   return total;
  // };

  // $scope.portfolioMarketValue = function() {
  //   var total = 0;
  //   for (var i = 0; i < $scope.portfolio.length; i++) {
  //     var stock = $scope.portfolio[i];
  //     total += (stock.last * stock.shares);
  //   }
  //   return total;
  // };

  // //api call to get stock quote
  $scope.getQuote = function (symbol) {
    $scope.quote = true;
    var stock = $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+symbol+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
    .then(function(data) {
      $scope.stockData = data.data.query.results.quote;
      console.log($scope.stockData);
    });
  };

  $scope.updateLast = function () {
    $scope.portfolio.forEach(function(obj){
      var symbol = obj.ticker;
      var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+symbol+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
      $http.get(url).then(function(data) {
        var lastTradePrice = data.data.query.results.quote.LastTradePriceOnly;
        obj.last = lastTradePrice;
        $scope.updateStock(obj._id, obj);
        $scope.refresh = new Date();
      });
    });
  };

  $scope.addStock = function (symbol) {

    var newStock = {
      ticker: $scope.stockData.Symbol,
      side: $scope.side,
      shares: $scope.shares,
      last: $scope.stockData.LastTradePriceOnly,
      costBasis: $scope.stockData.LastTradePriceOnly,
      date: new Date()
    };
    httpFactory.post('api/v1/stocks', newStock)
    .then(function(response) {
      $scope.portfolio.push(response.data);
      getStocks('api/v1/stocks');

    });

  };

//portfolio controller
//   $scope.xAxisTickFormatFunction = function(){
//   return function(date){
//     return d3.time.format('%x')(new Date(date));
//   };
// };
//   //epoch time
//   function getTime () {
//     var time = Math.round(new Date().getTime());
//     return time;
//   }

//   $scope.chartData =[];
//   $scope.portfolioDBValue = [];


// /////portfolio controller section
//   getPortfolio = function (url) {
//     httpFactory.get(url)
//     .then(function(response){
//       $scope.portfolioDBValue = response.data;
//     });
//   };

//   getPortfolio('chart/portfolio');

//   var valuesArray = [];

//   $scope.updatePortfolio = function () {

//     var newPortfolio = {
//       value: $scope.portfolioMarketValue(),
//       date: getTime(),
//     };
//     httpFactory.post('chart/portfolio', newPortfolio)
//     .then(function(response) {
//       $scope.portfolioDBValue.push(response.data);
//       getPortfolio('chart/portfolio');
//       console.log($scope.portfolioDBValue, "portfolio value from the database");

//       for(i=0; i < $scope.portfolioDBValue.length; i++){
//         var new_array = [$scope.portfolioDBValue[i].date, $scope.portfolioDBValue[i].value];
//           $scope.chartData.push(new_array);
//       }

//          $scope.portfolioData = [
//                 {
//                     "key": "Portfolio Value",
//                     "values": $scope.chartData
//                 }];

//     });

//   };


}]);

app.controller('PortfolioController', ['$scope', '$http', 'httpFactory' , function($scope, $http, httpFactory) {

  $scope.portfolio = [];

   $scope.editStock = function (id) {
    $scope.edit = true;
    var stockURL = "api/v1/stock/"+ id;
    httpFactory.get(stockURL)
    .then(function(response) {
      $scope.stock = response.data;
    });
  };

  $scope.updateStock = function (id, updatedStock) {
    var update = updatedStock;
    var stockURL = "api/v1/stock/"+ id;
    httpFactory.put(stockURL, update)
    .then(function(response){
      getStocks('api/v1/stocks');
      $scope.stock = {};
    });
  };

  $scope.deleteStock = function (id) {
    stockURL = "api/v1/stock/"+ id;
    httpFactory.delete(stockURL)
    .then(function(response) {
      getStocks('api/v1/stocks');
    });
  };

   //get stock from portfolio, api call to my database
  getStocks = function (url) {
    httpFactory.get(url)
    .then(function(response){
      $scope.portfolio = response.data;
    });
  };

  getStocks('api/v1/stocks');


  $scope.initialValue = function() {
    var total = 0;
    for (var i = 0; i < $scope.portfolio.length; i++) {
      var stock = $scope.portfolio[i];
      total += (stock.costBasis * stock.shares);
    }
    return total;
  };

  $scope.portfolioMarketValue = function() {
    var total = 0;
    for (var i = 0; i < $scope.portfolio.length; i++) {
      var stock = $scope.portfolio[i];
      total += (stock.last * stock.shares);
    }
    return total;
  };

  //portfolio controller
  $scope.xAxisTickFormatFunction = function(){
  return function(date){
    return d3.time.format('%x')(new Date(date));
  };
};
  //epoch time
  function getTime () {
    var time = Math.round(new Date().getTime());
    return time;
  }

  $scope.chartData =[];
  $scope.portfolioDBValue = [];


/////portfolio controller section
  getPortfolio = function (url) {
    httpFactory.get(url)
    .then(function(response){
      $scope.portfolioDBValue = response.data;
    });
  };

  getPortfolio('chart/portfolio');

  var valuesArray = [];

  $scope.updatePortfolio = function () {

    var newPortfolio = {
      value: $scope.portfolioMarketValue(),
      date: getTime(),
    };
    httpFactory.post('chart/portfolio', newPortfolio)
    .then(function(response) {
      $scope.portfolioDBValue.push(response.data);
      getPortfolio('chart/portfolio');
      console.log($scope.portfolioDBValue, "portfolio value from the database");

      for(i=0; i < $scope.portfolioDBValue.length; i++){
        var new_array = [$scope.portfolioDBValue[i].date, $scope.portfolioDBValue[i].value];
          $scope.chartData.push(new_array);
      }

         $scope.portfolioData = [
                {
                    "key": "Portfolio Value",
                    "values": $scope.chartData
                }];

    });

  };

    $scope.updateLast = function () {
    $scope.portfolio.forEach(function(obj){
      var symbol = obj.ticker;
      var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+symbol+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
      $http.get(url).then(function(data) {
        var lastTradePrice = data.data.query.results.quote.LastTradePriceOnly;
        obj.last = lastTradePrice;
        $scope.updateStock(obj._id, obj);
        $scope.refresh = new Date();
      });
    });
  };

  }]);

