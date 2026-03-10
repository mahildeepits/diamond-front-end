import axios from "axios"

const LiveRateApi = {
    url: import.meta.env.VITE_RATES_API,
    apiBaseUrl: import.meta.env.VITE_API_KEY,
    async fetch() {
        try {
            const diffRates = await axios.get(this.apiBaseUrl + "/admin/rate-differences");

            // Fetching Rates from API
            const { data } = await axios.get(this.url)

            // Silver Fetch
            const silverResp = await axios.get('https://bcast.arihantspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/arihantsilver?_=1748320216800').catch(() => null);
            let silverCostHigh = 0;
            let silverCostLow = 0;
            let silverRateHigh = 0;
            let silverRateLow = 0;
            if (silverResp && silverResp.data) {
                const sData = silverResp.data;
                silverCostHigh = parseFloat(sData.split("\t")[5]);
                silverCostLow = parseFloat(sData.split("\t")[6]);
                silverRateHigh = parseFloat(sData.split("\t")[19]);
                silverRateLow = parseFloat(sData.split("\t")[20]);
            }

            // Parsing Rates from API
            const costHigh = parseFloat(data.split("\t")[19]);
            const costLow = parseFloat(data.split("\t")[20]);
            const rateHigh = parseFloat(data.split("\t")[5]);
            const rateLow = parseFloat(data.split("\t")[6]);
            const rate = parseFloat(data.split("\t")[17]);
            const usd = parseFloat(data.split("\t")[10])
            const cost = parseFloat(data.split("\t")[3]);
            // Calculating TDS and TCS values
            const tcs = parseFloat(diffRates?.data?.data[0]?.including_tcs ?? 0);
            const tds = parseFloat(diffRates?.data?.data[0]?.including_tds ?? 0);
            const nextMonthTcs = parseFloat(diffRates?.data?.data[0]?.next_including_tcs ?? 0);
            const nextMonthTds = parseFloat(diffRates?.data?.data[0]?.next_including_tds ?? 0);
            const includingTcs = rate + tcs;
            const includingTds = rate + tds;
            const nextMonthIncludingTcs = rate + nextMonthTcs;
            const nextMonthIncludingTds = rate + nextMonthTds;
            const nextMonthRateStatus = (diffRates?.data?.data[0]?.next_month_rate_status ?? 0);
            // console.log(diffRates?.data?.data[0]?.including_tcs,tcs,'-------',diffRates?.data?.data[0]?.including_tds,tds);

            return { rate, usd, cost, includingTcs, includingTds, nextMonthIncludingTcs, nextMonthIncludingTds, nextMonthRateStatus, tcs, tds, nextMonthTcs, nextMonthTds, costHigh, costLow, rateHigh, rateLow, silverCostHigh, silverCostLow, silverRateHigh, silverRateLow };
        } catch (error) { console.log(error) }
    }
}

export default LiveRateApi;