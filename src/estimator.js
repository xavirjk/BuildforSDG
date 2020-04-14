class App {
  constructor() {
    this.cases = 0;
    this.mild = 0;
    this.severe = 0;
    this.periodType = 0;
    this.timeToElapse = 0;
    this.regionData = 0;
    this.totalHosBeds = 0;
    this.impact = {
      currentlyInfected: '',
      infectionsByRequestedTime: '',
      casesByRequestedTime: '',
      hospitalBedsByRequestedTime: '',
      casesForICUByRequestedTime: '',
      casesForVentilatorsByRequestedTime: '',
      dollarsInFlight: ''
    };
    this.severeImpact = {
      currentlyInfected: '',
      infectionsByRequestedTime: '',
      severeCasesByRequestedTime: '',
      hospitalBedsByRequestedTime: '',
      casesForICUByRequestedTime: '',
      casesForVentilatorsByRequestedTime: '',
      dollarsInFlight: ''
    };
    this.setData = (data) => {
      this.regionData = data.region;
      this.cases = data.reportedCases;
      this.periodType = data.periodType;
      this.timeToElapse = data.timeToElapse;
      this.totalHosBeds = data.totalHospitalBeds;
      if (data.periodType.toLowerCase() !== 'days') {
        this.toDays();
      }
    };
  }

  toDays() {
    if (this.periodType.toLowerCase() === 'weeks') {
      this.timeToElapse *= 7;
    } else if (this.periodType.toLowerCase() === 'months') {
      this.timeToElapse *= 30;
    }
  }

  estimateCurrentlyInfected() {
    this.impact.currentlyInfected = this.cases * 10;
    this.severeImpact.currentlyInfected = this.cases * 50;
  }

  estimateProjectedInfections() {
    const periodSets = parseInt(this.timeToElapse / 3, 10);
    // eslint-disable-next-line no-restricted-properties
    const factor = Math.pow(2, periodSets);
    this.impact.infectionsByRequestedTime = this.impact
      .currentlyInfected * factor;
    this.severeImpact.infectionsByRequestedTime = this.severeImpact
      .currentlyInfected * factor;
  }

  estimateProjectedInfectionsByReqTime() {
    this.mild = this.impact.infectionsByRequestedTime;
    this.severe = this.severeImpact.infectionsByRequestedTime;
    this.impact
      .casesByRequestedTime = parseInt((15 / 100) * this.mild, 10);
    this.severeImpact
      .severeCasesByRequestedTime = parseInt((15 / 100) * this.severe, 10);
  }
  // Returns the impact and Severe Impact data

  getData() {
    return {
      impact: this.impact,
      severeImpact: this.severeImpact
    };
  }

  estimateCasesForICU() {
    this.impact
      .casesForICUByRequestedTime = parseInt((5 / 100) * this.mild, 10);
    this.severeImpact
      .casesForICUByRequestedTime = parseInt((5 / 100) * this.severe, 10);
  }

  estimateCasesForVentilators() {
    this.impact
      .casesForVentilatorsByRequestedTime = parseInt((2 / 100) * this.mild, 10);
    this.severeImpact
      .casesForVentilatorsByRequestedTime = parseInt((2 / 100) * this.severe, 10);
  }

  estimateDollarsInFlight() {
    const AvgIncome = this.regionData.avgDailyIncomeInUSD;
    this.impact
      .dollarsInFlight = (0.65 * this.mild) * AvgIncome * this.timeToElapse;
    this.severeImpact
      .dollarsInFlight = (0.65 * this.severe) * AvgIncome * this.timeToElapse;
  }

  estimateHospitalBedsByReqTime() {
    const casesA = this.impact.casesByRequestedTime;
    const casesB = this.severeImpact.severeCasesByRequestedTime;
    const AvailBeds = parseInt((35 / 100) * this.totalHosBeds, 10);
    this.impact.hospitalBedsByRequestedTime = AvailBeds - casesA;
    this.severeImpact.hospitalBedsByRequestedTime = AvailBeds - casesB;
  }
}
const passToHelper = (data) => {
  const app = new App();
  app.setData(data);
  app.estimateCurrentlyInfected();
  app.estimateProjectedInfections();
  app.estimateProjectedInfectionsByReqTime();
  app.estimateHospitalBedsByReqTime();
  app.estimateCasesForICU();
  app.estimateCasesForVentilators();
  app.estimateDollarsInFlight();
  return app.getData();
};

const covid19ImpactEstimator = (data) => {
  const inputData = data;
  const res = passToHelper(inputData);
  return {
    data: inputData,
    impact: res.impact,
    impactSevere: res.severeImpact
  };
};
export default covid19ImpactEstimator;
