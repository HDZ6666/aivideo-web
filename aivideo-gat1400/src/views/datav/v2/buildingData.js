/**
 * 楼宇数据模拟文件
 */

// 楼宇数据
export const buildingsData = [
  {
    id: 1,
    name: '保利商务中心',
    position: [117.260879, 31.839088],
    image: 'https://via.placeholder.com/300x200/0a62b3/ffffff?text=保利商务中心',
    totalArea: 35000,
    buildingArea: 120000,
    totalLeasableArea: 95000,
    commercialArea: 30000,
    officeArea: 65000,
    commercialLeasableArea: 25000,
    officeLeasableArea: 60000,
    mainIndustry: '科技服务、金融',
    companyCount: 120,
    tenants: [
      {
        name: '安徽科技信息有限公司',
        creditCode: '91340100MA2RNL1X7B',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '张云',
        phone: '0551-6289xxxx',
        address: '保利商务中心A座1001室',
        establishDate: '2018-05-15',
        registeredCapital: '1000万元',
        industryCategory: '科技服务'
      },
      {
        name: '合肥金融科技有限公司',
        creditCode: '91340100MA2TNM2X8C',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '李明',
        phone: '0551-6532xxxx',
        address: '保利商务中心B座1503室',
        establishDate: '2019-08-23',
        registeredCapital: '5000万元',
        industryCategory: '金融科技'
      },
      {
        name: '安徽数字科技有限公司',
        creditCode: '91340100MA2UNP3X9D',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '王强',
        phone: '0551-6721xxxx',
        address: '保利商务中心A座2105室',
        establishDate: '2020-03-11',
        registeredCapital: '3000万元',
        industryCategory: '信息技术'
      }
    ]
  },
  {
    id: 2,
    name: '依云国际',
    position: [117.251879, 31.845088],
    image: 'https://via.placeholder.com/300x200/136d6d/ffffff?text=依云国际',
    totalArea: 40000,
    buildingArea: 150000,
    totalLeasableArea: 120000,
    commercialArea: 40000,
    officeArea: 80000,
    commercialLeasableArea: 35000,
    officeLeasableArea: 75000,
    mainIndustry: '互联网、广告传媒',
    companyCount: 95,
    tenants: [
      {
        name: '安徽智媒网络科技有限公司',
        creditCode: '91340100MA2RTP5X1E',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '刘伟',
        phone: '0551-6398xxxx',
        address: '依云国际1号楼1801室',
        establishDate: '2017-11-20',
        registeredCapital: '2000万元',
        industryCategory: '互联网'
      },
      {
        name: '合肥创意广告有限公司',
        creditCode: '91340100MA2SNP6X2F',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '陈晓',
        phone: '0551-6432xxxx',
        address: '依云国际2号楼1203室',
        establishDate: '2018-04-17',
        registeredCapital: '1000万元',
        industryCategory: '广告传媒'
      }
    ]
  },
  {
    id: 3,
    name: '信保广场',
    position: [117.265879, 31.842088],
    image: 'https://via.placeholder.com/300x200/135aa2/ffffff?text=信保广场',
    totalArea: 30000,
    buildingArea: 100000,
    totalLeasableArea: 80000,
    commercialArea: 30000,
    officeArea: 50000,
    commercialLeasableArea: 25000,
    officeLeasableArea: 45000,
    mainIndustry: '金融保险、咨询',
    companyCount: 85,
    tenants: [
      {
        name: '安徽保险经纪有限公司',
        creditCode: '91340100MA2RWQ7X3G',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '赵敏',
        phone: '0551-6543xxxx',
        address: '信保广场A座1201室',
        establishDate: '2016-09-12',
        registeredCapital: '5000万元',
        industryCategory: '金融保险'
      },
      {
        name: '合肥企业管理咨询有限公司',
        creditCode: '91340100MA2TPQ8X4H',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '孙明',
        phone: '0551-6678xxxx',
        address: '信保广场B座1503室',
        establishDate: '2017-06-25',
        registeredCapital: '1000万元',
        industryCategory: '咨询服务'
      }
    ]
  },
  {
    id: 4,
    name: '新睿广场',
    position: [117.257879, 31.847088],
    image: 'https://via.placeholder.com/300x200/407b23/ffffff?text=新睿广场',
    totalArea: 25000,
    buildingArea: 85000,
    totalLeasableArea: 70000,
    commercialArea: 25000,
    officeArea: 45000,
    commercialLeasableArea: 20000,
    officeLeasableArea: 40000,
    mainIndustry: '教育培训、医疗健康',
    companyCount: 65,
    tenants: [
      {
        name: '安徽智慧教育科技有限公司',
        creditCode: '91340100MA2RTR9X5I',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '周健',
        phone: '0551-6721xxxx',
        address: '新睿广场1号楼1501室',
        establishDate: '2018-07-13',
        registeredCapital: '2000万元',
        industryCategory: '教育培训'
      },
      {
        name: '合肥健康医疗管理有限公司',
        creditCode: '91340100MA2SPQ0X6J',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '郑华',
        phone: '0551-6832xxxx',
        address: '新睿广场2号楼1103室',
        establishDate: '2019-03-22',
        registeredCapital: '3000万元',
        industryCategory: '医疗健康'
      }
    ]
  },
  {
    id: 5,
    name: '金海文化创意中心',
    position: [117.270879, 31.836088],
    image: 'https://via.placeholder.com/300x200/9d236d/ffffff?text=金海文化创意中心',
    totalArea: 28000,
    buildingArea: 90000,
    totalLeasableArea: 75000,
    commercialArea: 30000,
    officeArea: 45000,
    commercialLeasableArea: 25000,
    officeLeasableArea: 40000,
    mainIndustry: '文化创意、设计',
    companyCount: 70,
    tenants: [
      {
        name: '安徽创意设计有限公司',
        creditCode: '91340100MA2RUS1X7K',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '吴艺',
        phone: '0551-6943xxxx',
        address: '金海文化创意中心A座901室',
        establishDate: '2017-12-05',
        registeredCapital: '500万元',
        industryCategory: '创意设计'
      },
      {
        name: '合肥文化传媒有限公司',
        creditCode: '91340100MA2TRT2X8L',
        status: '正常营业',
        category: '有限责任公司',
        legalPerson: '张文',
        phone: '0551-7021xxxx',
        address: '金海文化创意中心B座1003室',
        establishDate: '2018-09-18',
        registeredCapital: '1000万元',
        industryCategory: '文化传媒'
      }
    ]
  }
];

/**
 * 根据楼宇ID获取楼宇数据
 * @param {number} id 楼宇ID
 * @returns {Object|null} 楼宇数据对象或null
 */
export const getBuildingById = (id) => {
  return buildingsData.find(building => building.id === id) || null;
};

/**
 * 获取所有楼宇位置数据（用于地图标记）
 * @returns {Array} 楼宇位置数据数组
 */
export const getBuildingsPositions = () => {
  return buildingsData.map(building => ({
    id: building.id,
    name: building.name,
    position: building.position,
    companyCount: building.companyCount
  }));
}; 