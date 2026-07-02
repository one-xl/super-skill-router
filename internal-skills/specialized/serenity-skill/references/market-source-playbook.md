# Market Source Playbook

Use this file when the market determines which source path matters.

## US

Primary source path:

- SEC 10-K, 10-Q, 8-K, S-1, S-3, Form 4.
- Earnings transcripts and investor presentations.
- Company press releases and product pages.
- Customer and supplier filings.
- Standards bodies, patents, conference papers, and trade publications.

Important checks:

- shelf registration, ATM, converts, SBC, insider selling;
- customer concentration;
- backlog and revenue mix;
- gross margin and utilization;
- short interest and options-driven volatility;
- sell-side estimate gap.

## A-shares

Primary source path:

1. **官方信披平台与交易所**:
   - 巨潮资讯网 (CNINFO)：所有 A 股公司官方指定信息披露媒体，获取年报、半年报、季报、定增预案、可转债募集说明书、重大合同、重大投融资、扩产公告等。
   - 上交所 (SSE)、深交所 (SZSE)、北交所 (BSE) 官网：下载监管问询函（重组问询、年报问询、关注函等）及其公司回复函。回复函中通常包含极具价值的细分产品数据、客户明细、产能情况及审计细节。
2. **投资者互动平台 (交互证据)**:
   - 深交所互动易、上交所上证e互动：查看公司与投资者的日常问答。可作为收集订单线索、客户认证进度、样品送样测试等最新动态的辅助途径。
   - *证据评级要求*：互动易言论需与官方公告核对，未有公告证实的仅视为中/弱证据（Medium/Weak Lead），不能作为单一核心支撑。
3. **产能与产线建设验证 (物理瓶颈证据)**:
   - 地方政府发展和改革委员会（发改委）及地方政务网：查询项目备案、项目核准、投资备案公示。
   - 地方生态环境局（环保局）环评公示（建设项目环境影响报告书/表）：这是跟踪扩产最真实的硬证据之一。环评报告中会详细披露产品设计产能、所购核心设备型号与数量、工艺流程图、原材料供应商及主要产线建设周期。
   - 地方发展改革委能评审查公示：验证大功耗项目（如半导体晶圆厂、数据中心）的用电与能耗额度是否获批。
4. **订单与业务验证 (商业证据)**:
   - 招投标采购平台（如中国政府采购网、采招网、军队采购网等）：核实公司中标情况、订单金额及采购方。
   - 海关总署/地方海关数据：对出口占比高的半导体、材料、设备或核心器件公司，通过HS编码（海关编码）和主要港口出口统计数据验证行业出口景气度与出货变化。
   - 行业协会与第三方技术研究机构数据：如中国半导体行业协会 (CSIA)、中国化学与物理电源行业协会、TrendForce、集邦咨询、IC Insights 等，验证宏观供需。
5. **专利与技术壁垒验证**:
   - 国家知识产权局 (CNIPA) 专利查询系统、SooPAT、Google Patents：验证公司是否真的掌握关键技术（如高端刻蚀机反应腔、CMP抛光液配方等），核对专利授权时间、发明人与核心技术路线是否与宣传一致。
6. **上下游供应链交叉印证 (Cross-Check)**:
   - 通过下游大客户（通常是美股、港股或 A 股其他龙头企业）的采购公告、财报供应商列表、招投标公示进行反向验证，确保供应链关系的真实存在。

Important checks:

1. **资产与现金流健康度 (防止财务造假)**:
   - **存贷双高**：公司账面拥有巨额货币资金，同时却存在大量高利息的短期或长期借款。需核实是否存在大股东资金占用、虚假存款或受限资金。
   - **应收账款与坏账**：应收账款增幅远超营业收入增幅，或者应收账款账龄持续老化。检查信用减值损失对扣非净利润的吞噬程度。
   - **存货周转与跌价准备**：对于半导体、消费电子等技术迭代快的环节，存货（原材料、在制品、产成品）急剧增加且周转天数拉长，必须警惕存货跌价准备（资产减值损失）对利润的冲击。
   - **经营现金流与净利润背离**：扣非净利润表现亮眼但经营活动产生的现金流量净额持续为负，警惕虚假销售或垫资销售。
2. **利润调节核查**:
   - **研发费用资本化**：部分公司通过将研发支出由“费用化”转为“资本化”（计入无形资产/开发支出），从而虚增当期利润。必须核查研发资本化率是否异常偏高（如超过20%）。
   - **非经常性损益/补贴依赖**：扣非前利润为正，扣非后利润为负或极低。检查“政府补助”、“税收返还”以及“非流动资产处置损益”占利润总额的比例，判断主营业务的真实盈利能力。
3. **控制权与治理风险**:
   - **大股东股权质押**：大股东或实际控制人质押比例过高（如累计质押超过持股比例的70%以上）。在市场剧烈波动时存在强平爆仓、公司控制权变更和流动性危机风险。
   - **商誉减值隐患**：溢价收购（并购重组）产生巨额商誉。一旦被收购子公司业绩不及预期，将面临商誉减值爆雷风险。
   - **关联交易与利益输送**：采购或销售严重依赖关联方，定价是否公允，是否存在向关联方输送利益或粉饰报表的行为。
4. **融资与稀释压力**:
   - **定增 (Private Placement) 与可转债 (Convertible Bonds)**：关注募投项目的合理性、稀释每股收益 (EPS) 的比例，以及可转债转股期对股价的长期压制。
5. **合规与退市风险**:
   - **ST 与 *ST 警示**：净利润连续亏损、营业收入低于规定标准，或因财务造假被实施退市风险警示。坚决规避被实施退市风险警示的标的。
   - **立案调查与问询函**：大股东、高管或公司被中国证监会立案调查，或者频繁收到交易所年报/重组问询函且迟迟不予回复。

## Hong Kong

Primary source path:

- HKEX filings.
- Annual and interim reports.
- Placing, subscription, convertible, and connected-transaction announcements.
- Company presentations.
- Mainland regulatory documents when the business is China-heavy.

Important checks:

- liquidity and spread;
- refinancing pressure;
- related-party governance;
- Stock Connect eligibility;
- mainland policy exposure;
- management alignment.

## Taiwan

Primary source path:

- MOPS filings.
- Monthly revenue reports.
- Company IR decks.
- Customer and supplier cross-checks.
- Trade publications and conference materials.

Important checks:

- monthly revenue inflection;
- customer concentration;
- FX sensitivity;
- cross-strait/geopolitical risk;
- capacity and qualification schedule.

## Japan

Primary source path:

- TDnet filings.
- Earnings materials.
- Integrated reports.
- Segment data.
- Trade journals and industry association materials.

Important checks:

- conservative guidance;
- currency sensitivity;
- cross-shareholdings and governance reform;
- low coverage;
- acquisition optionality.

## Korea

Primary source path:

- DART filings.
- Export statistics.
- Company IR materials.
- Customer ecosystem disclosures.
- Trade publications.

Important checks:

- large-customer dependence;
- memory-cycle exposure;
- FX and geopolitical risk;
- retail theme volatility;
- capex cycle timing.

## Europe

Primary source path:

- local exchange filings;
- annual reports and ad hoc releases;
- EU grant/project documents;
- customer partnership announcements;
- trade journals and standards bodies.

Important checks:

- liquidity;
- translation risk;
- government grant dependence;
- acquisition optionality;
- specialist investor coverage gaps.
