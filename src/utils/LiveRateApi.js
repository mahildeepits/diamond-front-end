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
            let silverRate = 0;
            let silverCost = 0;
            let silverCostHigh = 0;
            let silverCostLow = 0;
            let silverRateHigh = 0;
            let silverRateLow = 0;
            
            if (silverResp && silverResp.data) {
                const sData = silverResp.data.split("\t");
                silverRate = parseFloat(sData[3]);
                silverCost = parseFloat(sData[17]);
                silverRateHigh = parseFloat(sData[5]);
                silverRateLow = parseFloat(sData[6]);
                silverCostHigh = parseFloat(sData[19]);
                silverCostLow = parseFloat(sData[20]);
            }

            // Parsing Gold Rates from API
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
            const silverTds = parseFloat(diffRates?.data?.data[0]?.including_silver_tds ?? 0);
            const nextMonthSilverTds = parseFloat(diffRates?.data?.data[0]?.next_month_silver_tds ?? 0);

            const includingTcs = rate + tcs;
            const includingTds = rate + tds;
            const nextMonthIncludingTcs = rate + nextMonthTcs;
            const nextMonthIncludingTds = rate + nextMonthTds;
            const includingSilverTds = silverCost + silverTds;
            const nextMonthIncludingSilverTds = silverCost + nextMonthSilverTds;
            
            const nextMonthRateStatus = (diffRates?.data?.data[0]?.next_month_rate_status ?? 0);
            const retailGoldTds = parseFloat(diffRates?.data?.data[0]?.including_retail_gold_tds ?? 0);
            const retailGoldRate = rate + retailGoldTds;
            const retailGoldRateStatus = (diffRates?.data?.data[0]?.retail_gold_rate_status ?? 0);

            const contactDetails = await axios.get(this.apiBaseUrl + "/admin/contact/details").catch(() => null);
            const contact = contactDetails?.data?.data || null;

            return { 
                rate, usd, cost, 
                includingTcs, includingTds, 
                nextMonthIncludingTcs, nextMonthIncludingTds, 
                nextMonthRateStatus, tcs, tds, nextMonthTcs, nextMonthTds, 
                costHigh, costLow, rateHigh, rateLow, 
                silverRate, silverCost, includingSilverTds, silverTds,
                silverCostHigh, silverCostLow, silverRateHigh, silverRateLow, 
                retailGoldRate, retailGoldRateStatus,
                contact
            };
        } catch (error) { console.log(error) }
    }
}

export default LiveRateApi;