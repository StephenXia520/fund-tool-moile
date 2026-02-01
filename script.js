// 你的持仓数据
const funds = [
    { code: "000971", name: "中欧新蓝筹灵活配置混合A", value: 23.31, profit: 15.34, rate: 153.36 },
    { code: "012164", name: "中欧红利优享灵活配置混合C", value: 10711.07, profit: 906.51, rate: 9.85 },
    { code: "004394", name: "中欧资源精选混合C", value: 489.12, profit: 28.81, rate: 6.26 },
    { code: "003096", name: "中欧医疗健康混合C", value: 2438.70, profit: -454.54, rate: -15.73 },
    { code: "011593", name: "易方达国防军工混合C", value: 9590.36, profit: 1645.15, rate: 20.71 }
];

// 渲染基金列表
function renderFunds() {
    const list = document.getElementById("fund-list");
    list.innerHTML = "";
    funds.forEach(fund => {
        const item = document.createElement("div");
        item.className = "fund-item";
        item.innerHTML = `
            <div class="fund-name">${fund.name}</div>
            <div class="fund-info">
                <span>持有金额：${fund.value.toFixed(2)}元</span>
                <span id="val-${fund.code}">加载中...</span>
            </div>
            <div class="fund-profit">
                <span class="${fund.profit >= 0 ? 'plus' : 'minus'}">收益：${fund.profit >= 0 ? '+' : ''}${fund.profit.toFixed(2)}元</span>
                <span>收益率：${fund.rate >= 0 ? '+' : ''}${fund.rate.toFixed(2)}%</span>
            </div>
        `;
        list.appendChild(item);
    });
}

// 获取实时估值
async function getValuation(code) {
    try {
        const res = await fetch(`https://fundmobapi.eastmoney.com/FundMobiApi/JS/FundEstimateApi.ashx?fundcode=${code}`);
        const data = (await res.text()).replace(/^jsonp\(|\)$/g, '').split(',');
        if (data.length >= 3) {
            const rate = parseFloat(data[2].replace('%', ''));
            return `估值：${rate >= 0 ? '+' : ''}${rate.toFixed(2)}%`;
        }
        return "估值加载失败";
    } catch (e) {
        return "估值加载失败";
    }
}

// 刷新估值
async function refreshValuation() {
    for (const fund of funds) {
        const val = await getValuation(fund.code);
        document.getElementById(`val-${fund.code}`).textContent = val;
    }
}

// 初始化
window.onload = () => {
    renderFunds();
    refreshValuation();
    document.getElementById("refresh-btn").addEventListener('click', refreshValuation);
};
