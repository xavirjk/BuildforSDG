class App{
    constructor(){
        this.cases;
        this.mild;
        this.severe;
        this.periodType;
        this.timeToElapse;
        this.regionData;
        this.totalHosBeds;
        this.impact={
            currentlyInfected:'',
            infectionsByRequestedTime:'',
            mildCasesByRequestedTime:'',
            hospitalBedsByRequestedTime:'',
            casesForICUByRequestedTime:'',
            casesForVentilatorsByRequestedTime:'',
            dollarsInFlight:''
        };
        this.severeImpact={
            currentlyInfected:'',
            infectionsByRequestedTime:'',
            severeCasesByRequestedTime:'',
            hospitalBedsByRequestedTime:'',
            casesForICUByRequestedTime:'',
            casesForVentilatorsByRequestedTime:'',
            dollarsInFlight:''
        };
        this.setData=(data)=>{
            this.regionData=data.region;
            this.cases=data.reportedCases;
            this.periodType=data.periodType;
            this.timeToElapse=data.timeToElapse;
            this.totalHosBeds=data.totalHospitalBeds;
            if(data.periodType.toLowerCase() != "days"){
                this.toDays();
            }
        }
    }
    toDays(){
        if(this.periodType.toLowerCase()== "weeks"){
            this.timeToElapse=this.timeToElapse * 7;
        }
        else if(this.periodType.toLowerCase()=="months"){
            this.timeToElapse=this.timeToElapse * 30;
        }
    }
    estimateCurrentlyInfected(){
        this.impact.currentlyInfected=this.cases*10;
        this.severeImpact.currentlyInfected=this.cases * 50;
    }
    estimateProjectedInfections(){
        let periodSets,factor;
        periodSets=parseInt(this.timeToElapse/3);
        factor=Math.pow(2,periodSets);
        this.impact.infectionsByRequestedTime=this.impact
        .currentlyInfected * factor;
        this.severeImpact.infectionsByRequestedTime=this.severeImpact
        .currentlyInfected * factor;
    }
    estimateProjectedInfectionsByReqTime(){
        this.mild=this.impact.infectionsByRequestedTime;
        this.severe=this.severeImpact.infectionsByRequestedTime;
        this.impact
        .mildCasesByRequestedTime=parseInt((15/100) * this.mild);
        this.severeImpact
        .severeCasesByRequestedTime=parseInt((15/100) * this.severe);
    }
    //Returns the impact and Severe Impact data
    getData(){

        return{
            impact:this.impact,
            severeImpact:this.severeImpact
        }
    }
    estimateCasesForICU(){
        this.impact
        .casesForICUByRequestedTime=parseInt((5/100)*this.mild);
        this.severeImpact
        .casesForICUByRequestedTime=parseInt((5/100)*this.severe);
    }
    estimateCasesForVentilators(){
        this.impact
        .casesForVentilatorsByRequestedTime=parseInt((2/100)*this.mild);
        this.severeImpact
        .casesForVentilatorsByRequestedTime=parseInt((2/100)*this.severe);
    }
    estimateDollarsInFlight(){
        var AvgIncome=this.regionData.avgDailyIncomeInUSD;
        this.impact
        .dollarsInFlight=(0.65*this.mild)*AvgIncome*this.timeToElapse;
        this.severeImpact
        .dollarsInFlight=(0.65*this.severe)*AvgIncome*this.timeToElapse;
        
    }
    estimateHospitalBedsByReqTime(){
       let casesA=this.impact.mildCasesByRequestedTime;
       let casesB=this.severeImpact.severeCasesByRequestedTime;
       var AvailBeds=parseInt((35/100)*this.totalHosBeds);
       this.impact.hospitalBedsByRequestedTime=AvailBeds-casesA;
       this.severeImpact.hospitalBedsByRequestedTime=AvailBeds-casesB;
    }

}
const helper=(data)=>{
    let app=new App();
    app.setData(data);
    app.estimateCurrentlyInfected();
    app.estimateProjectedInfections();
    app.estimateProjectedInfectionsByReqTime();
    app.estimateHospitalBedsByReqTime();
    app.estimateCasesForICU();
    app.estimateCasesForVentilators();
    app.estimateDollarsInFlight();
    
    return app.getData();
    
}
const covid19ImpactEstimator = (data) =>{
    var res=helper(data);
    return{
        data:data,
        impact:res.impact,
        severeImpact:res.severeImpact
    };
}

export default covid19ImpactEstimator;
