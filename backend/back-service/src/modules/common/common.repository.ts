import { dataSource } from "src/core/data-source";
import { Area, Source, Lookups, PaymentMode, LabelRemarks, City, Country, State } from "erp-db";
import { getLookupType } from "./dto/getLookupType.dto";
import { SourceResponse } from "./dto/source.interface.dto";
import { PaymentModeResponse } from "./dto/payment-mode.interface.dto";
import { LabelRemarksResponse } from "./dto/label-emarks.interface.dto";
import { Configurations } from "erp-db";
export const lookupRepository = dataSource.getRepository(Lookups).extend({
    async getLookUpByType(lookupType: getLookupType): Promise<Lookups[]> {
        const data = await lookupRepository.findAndCount({
            where: {
                type: lookupType.types,
                active: true
            }
        })
        return data[0];
    }
});

export const areaRepository = dataSource.getRepository(Area);

export const cityRepository = dataSource.getRepository(City);

export const countryRepository = dataSource.getRepository(Country);

export const stateRepository = dataSource.getRepository(State);

export const sourceRepository = dataSource.getRepository(Source).extend({
    async getSource(): Promise<SourceResponse> {
        const data = await sourceRepository.findAndCount();
        const result: SourceResponse = {
            rows: data[0],
            count: data[1]
        }
        return result;
    }
});

export const paymentModeRepository = dataSource.getRepository(PaymentMode).extend({
    async getPaymentModeMode(): Promise<PaymentModeResponse> {
        const data = await paymentModeRepository.find({order:{sequence:"ASC"}});
        const result: PaymentModeResponse = {
            rows: data,
            count: data.length
        }
        return result;
    }
});


export const labelRemarksRepository = dataSource.getRepository(LabelRemarks).extend({
    async getLabelRemarks(): Promise<LabelRemarksResponse> {
        const data = await labelRemarksRepository.findAndCount();
        const result: LabelRemarksResponse = {
            rows: data[0],
            count: data[1]
        }
        return result;
    }
});

export const ConfigurationsRepository = dataSource.getRepository(Configurations)

