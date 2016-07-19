angular.module("employmentApp", ['ngMaterial'])
    .factory("testService", function($rootScope,$http){
        var tsService = {};
        tsService.AllQuestions = [];
        tsService.AllJobs = [];
        $http({
            method: "GET",
            url: "/emp/api.json"
        }).then(function(response){
            tsService.AllQuestions = response.data.questions;
            tsService.AllJobs = response.data.jobs;
        },function(response){
            
        });

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
        tsService.answerQuestion = function(id, answer){
            tsService.AllQuestions[id].answer = answer;
        };
        tsService.broadcastQuestion = function(){
            console.log("new Question");
            $rootScope.$broadcast("newQuestion");
            
        };
        tsService.testTimeOut = false;
        return tsService;
    
}).controller("mainController",["$scope", "testService", "$timeout", function($scope, testService, $timeout){
        $scope.questionId = 0;
        $scope.test = "my test";
        $scope.timer = 0;
        $scope.testTimeOut = testService.testTimeOut;
        $scope.testStarted = false;
        $scope.for = "";
        $scope.testService = testService;
        $scope.$watch("userName", function(){
            if($scope.userName.length > 1){
                $scope.for = " for ";
            }else{
                $scope.for = "";
            }
        });
        $scope.testTypeOptions = [
            {
                name: "Select Job Position",
                value: ""
            },
            {
            name: "Jr. Web Developer",
            value: "Jr. Web Developer"
            },
            {
            name: "Web Developer", 
                value: "Web Developer"
            }
            
            ];
        var testTimeout = function(){
            //Test timeout reached 5 minutes and they should be done by now
            
            
            
        }
        var timerfn = function(){
            //console.log($scope.timer);
            $scope.timer++;
            $timeout(timerfn, 1000);
        }
        $scope.startTest = function(){
            $scope.testStarted = true;
            //console.log("test started");
            testService.prepQuestion({
                "Id": 1,
                "Question": "My First Questions",
                "Answer":"I lied",
                "Type": "multiple-choice",
                "Options": [1,2,3,4]
            });
            $scope.questionId = testService.CurrentQuestion.Id;
            $timeout(timerfn, 1000);
        };
        $scope.$on("newQuestion", function(){
            
            $scope.questionId = testService.CurrentQuestion.Id;
            
        });
        $scope.formatTime = function(){
            if($scope.timer >= 300){
                testTimeout();   
            }
            var disTime = "";
            var tmp = $scope.timer / 60;
            //console.log(disTime);
            if(tmp < 1){
                var minutes = $scope.timer < 10 ? "0" + $scope.timer.toString() : $scope.timer.toString();
                disTime = ":"+minutes;
            }else{
                var wholetmp = tmp.toString().split(".");
                var min = wholetmp[0];
                var full = parseInt(min);
                var minutes = $scope.timer - (full * 60)
                if(minutes < 10){
                    minutes = "0"+minutes.toString();
                }
                var disTime = min.toString() + ":" + minutes.toString();
            }
            return disTime;
            
        }
}]).controller("testController", ["$scope", "testService","$timeout", function($scope, testService, $timeout){
    $scope.testTimeOut = testService.testTimeOut;
    $scope.TestQuestion = {
            "Id": 0,
            "Question": "",
            "Answer":"",
            "Type": "",
            "Options": ""
        };
    $scope.$on("newQuestion", function(){
        $scope.TestQuestion = testService.CurrentQuestion;
        $timeout(function(){
            jQuery(".open-ended").numberedtextarea();
        }, 500);
    });
    $scope.nextQuestion = function(){
        console.log($scope.TestQuestion.Id);
        testService.prepQuestion(testService.AllQuestions[$scope.TestQuestion.Id])
    }
}])