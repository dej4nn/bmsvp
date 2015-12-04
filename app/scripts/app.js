'use strict';

// Declare app level module which depends on views, and components
        
var app = angular.module("bmsApp", ["ngRoute", "ngWebSocket"]);


app.run(function ($rootScope, $websocket, $location) {
        var ws = $websocket("ws://localhost:8383/echo/");
    
    /*
     * Hilfsfunktion für das Aktivschalten der Menütabs
     */
    $rootScope.getClass = function (path) {
        if ($location.path() === path) {
            return 'active';
        } else {
            return '';
        }
    }
    /*
    "bms_status":[
    {"id":"1", "valueName":"Battery Status Flag", "value":"1"}, 
    {"id":"1", "valueName":"Protection Flag", "value":"1"}, 
    {"id":"1","valueName":"Power Reduction Flag" , "value":"1"},
            ...
    ]*/
    
    $rootScope.bms_status = [ 
        { 
            id:'1' , valueName:'Battery Status Flag' , value:'1'
            
        },
        { 
            id:'2' , valueName:'Protection Flag' , value:'1'
        },
        { 
            id:'3' , valueName:'Power Reduction Flag' , value:'1'
        },
        { 
            id:'4' , valueName:'Pin Status Flag' , value:'1'
        },
        { 
            id:'5' , valueName:'Charging State' , value:'1'
        },
        { 
            id:'6' , valueName:'Last Charging Error' , value:'12:00:00 12/12/2015'
        },
        { 
            id:'7' , valueName:'Stage Duration' , value:'1'
        }
        ];
        
        $rootScope.selectedParameter;
        $rootScope.selectedParameterName;
    /* 
     * Ersetzt alle MessageHandler des Websockets mit dem neuen. Wird beim 
     * Ändern der Ansicht aufgerufen.
     */
    $rootScope.setMessageHandler = function (handler) {
        ws.onMessageCallbacks = [];
        ws.onMessage(handler);
    };

    /*
     * Sendet eine Nachricht über den Websocket.
     */
    $rootScope.send = function (obj) {
        if (ws.readyState !== 3) {
            ws.send(obj);
        }
        else {
            alert("Bitte laden Sie die Seite neu!")
        }
    };

});

// Routing mit 1 Seite
app.config(function ($routeProvider) {
    $routeProvider

            .when("/vis", {
                templateUrl: "pages/vis.html",
                controller: "visController"
            })
            
            .when("/param", {
                templateUrl: "pages/param.html",
                controller: "paramController"
            })
            
            .when("/vis_v2", {
                templateUrl: "pages/vis_v2.html",
                controller: "visV2Controller"
            })
            
            .when("/values", {
                templateUrl: "pages/values.html",
                controller: "valuesController"
            })
            
            .when("/", {
                templateUrl: "pages/info.html",
                controller: "infoController"
            })
});

//Controller für die Visualisierungs-Page
app.controller("visV2Controller", function ($scope, $rootScope) {
    $scope.stage_duration = "1";

        $rootScope.setMessageHandler(function (event) {
        var obj = JSON.parse(event.data);
        
        
    });
        
        $scope.showValues = function(param){
            
            if(param = "bms_status"){
                $rootScope.selectedParameter = $rootScope.bms_status;
                $rootScope.selectedParameterName = "BMS Status";
            }
        };
        
        $scope.goToValues = function() {
        }
});

app.controller("visController", function ($scope, $rootScope) {
    $scope.my = { hideBMSStatus: true,
                  hideCurrentAndVoltage: true};
    
    $scope.st1 = ""; //Diese Nachricht liefert eine allgemeine Information über den Zustand der Batterie
    $scope.battery_status_flags = "1";
    $scope.protection_flag = "1";
    $scope.power_reduction_flag = "1";
    $scope.pin_status_flag = "1";
    $scope.charging_state = "1";
    $scope.last_charging_error = "1"; //TDB
    $scope.stage_duration = "1";
    
    $scope.cv1 = ""; //Informationen über den vom BMS gemessenen 
                     //Batteriestrom und die Batteriespannung.
                     //TOTAL_VOLTAGE: mV
                     //TOTAL_CURRENT: mA
    $scope.total_voltage="1";
    $scope.total_current="1";
    
    $scope.bt1 = ""; //Diese Nachricht enthält eine Zusammenfassung der Temperaturen in der Batterie.
    $scope.number_of_cells_bt1 = "";
    $scope.min_temperature = "";
    $scope.min_temperature_id = "";
    $scope.max_temperature = "";
    $scope.max_temperature_id = "";
    $scope.average_temperature = "";
    
    $scope.te1 = ""; //Jeweils ein Zähler, der die entnommene und die geladene Gesamtenergie in Ws zählt.
    $scope.energy_in = "";
    
    
    $scope.tc1 = ""; //Ladungsinformationen der Batterie
    $scope.battery_charge = "";
    
    $scope.bv1 = ""; //Battery Voltage Zusammenfassung
    $scope.min_cell_voltage = "";
    
    $scope.bc1 = ""; //Zusammenfassung der Zellspannungen.
    $scope.charge_limit = "";
    
    $scope.cd1 = ""; //Informationen für die einzelnen Zellen. 
                     //Die Nachricht wird nur nach Anfrage gesendet.
    $scope.cell_id = "";
    
    $scope.cns = ""; //Sent CAN Message
    $scope.can_identifier = "";
    
    $scope.in1 = ""; //Zusammenfassung der Zellspannungen
    $scope.inputs = "";
    
    $scope.ot1 = ""; ////Zusammenfassung der Zellspannungen
    $scope.contactors = "";
    
    $scope.td1 = ""; //Datum und die Uhrzeit der BMS internen Uhr
    $scope.year = "";
    
    $scope.vr1 = ""; //nformationen über die Hardware, Seriennummer und Firmwareversion
    $scope.hardware_type = "";
    
    $rootScope.setMessageHandler(function (event) {
        var obj = JSON.parse(event.data);
        
        $scope.battery_status = obj.values[0].BATTERY_STATUS;
        $scope.protection_flag = obj.values[1].PROTECTION_FLAG;
        $scope.power_reduction_flag = obj.values[2].POWER_REDUCTION_FLAG;
        $scope.pin_status_flag = obj.values[3].PIN_STATUS_FLAG;
        $scope.charging_state = obj.values[4].CHARGING_STATE;
        $scope.last_charging_error = obj.values[5].LAST_CHARCHING_ERROR;
        $scope.stage_duration = obj.values[6].STAGE_DURATION;
        
    });
    
    $scope.maximize = function(toHide){
        if(toHide === hideBMSStatus){
            hideBMSStatus = false;
        }
        
        if(toHide === hideCurrentAndVoltage){
            hideCurrentAndVoltage = false;
        }
    };
    
    $scope.minimize = function(toHide){
        if(toHide === hideBMSStatus){
            hideBMSStatus = true;
        }
        
        if(toHide === hideCurrentAndVoltage){
            hideCurrentAndVoltage = true;
        }
    };
    
});

//Controller für die Parametrierungs-Page
app.controller("paramController", function ($scope, $rootScope) {
    
});

//Controller für die Werte-Page
app.controller("valuesController", function ($scope, $rootScope) {
        $rootScope.bms_status[4].value = Math.random();
        $rootScope.bms_status[6].value = Math.random();
});

//Controller für die Info-Page
app.controller("infoController", function ($scope, $rootScope) {
    
});