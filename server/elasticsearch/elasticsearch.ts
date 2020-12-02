import { Client } from 'elasticsearch';
import config from '../config';

export default new Client(config.elasticsearch);

export type EsReportSource = {
  Roster: {
    edipi: string
    firstName: string
    lastName: string
    unit: string
    startDate: string
    endDate: string
    lastReported: number
  }
  EDIPI: string
  ID: string
  Timestamp: number
  Score: number
  API: {
    Stage: string
  }
  Browser: {
    TimeZone: string
  }
  Category: string
  Client: {
    Application: string
    Environment: string
    GitCommit: string
    Origin: string
  }
  Details: {
    Conditions: string[]
    Confirmed: number
    Lodging: string
    PhoneNumber: string
    Symptoms: string[]
    TalkToSomeone: number
    TemperatureFahrenheit: number
    Unit: string
  }
  Model: {
    Version: string
  }
};
