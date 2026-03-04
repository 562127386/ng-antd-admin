export interface SamplingSchemeConfig {
  schemeType: number;
  aqlConfig?: AqlSamplingConfig;
  cZeroConfig?: CZeroSamplingConfig;
  variableConfig?: VariableSamplingConfig;
  continuousConfig?: ContinuousSamplingConfig;
  skipLotConfig?: SkipLotSamplingConfig;
}

export interface AqlSamplingConfig {
  aqlConfigId?: string;
  inspectionLevel?: number;
  aqlValue?: number;
}

export interface CZeroSamplingConfig {
  fixedSampleSize?: number;
  acceptanceNumber?: number;
  rejectionNumber?: number;
}

export interface VariableSamplingConfig {
  sampleSize?: number;
  kValue?: number;
  sigmaKnown?: boolean;
}

export interface ContinuousSamplingConfig {
  iQualityLevel?: number;
  samplePercentage?: number;
  fFrequency?: number;
}

export interface SkipLotSamplingConfig {
  skipLotNumber?: number;
  iQualityLevel?: number;
  lotSize?: number;
}
