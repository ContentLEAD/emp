angular.module("employmentApp", [])
    .factory("testService", function($rootScope){
        var tsService = {};
        tsService.CurrentQuestion = {
            "Id": 0,
            "Question": "",
            "Answer":"",
            "Type": "",
            "Options": ""
        };
        tsService.prepQuestion = function(question){
            this.CurrentQuestion = question;
            this.broadcastQuestion();
        };
        tsService.broadcastQuestion = function(){
            console.log("new Question");
            $rootScope.$broadcast("newQuestion");
            
        };
        return tsService;
    
}).controller("mainController",["$scope", "testService", function($scope, testService){
        $scope.questionId = 0;
        $scope.test = "my test";
        
        $scope.startTest = function(){
            console.log("test started");
            testService.prepQuestion({
                "Id": 1,
                "Question": "My First Questions",
                "Answer":"I lied",
                "Type": "multiple-choice",
                "Options": [1,2,3,4]
            });
            $scope.questionId = testService.CurrentQuestion.Id;
        };
        $scope.$on("newQuestion", function(){
            
            $scope.questionId = testService.CurrentQuestion.Id;
            
        })
}]).controller("testController", ["$scope", "testService", function($scope, testService){
    
    $scope.TestQuestion = {
            "Id": 0,
            "Question": "",
            "Answer":"",
            "Type": "",
            "Options": ""
        };
    $scope.$on("newQuestion", function(){
        $scope.TestQuestion = testService.CurrentQuestion;
    })
}])