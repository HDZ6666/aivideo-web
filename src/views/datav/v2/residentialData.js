// 小区/公寓数据
export const residentialData = [
  {
    id: 'residential_1',
    name: '阳光花园小区',
    group: 'A组',
    totalBuildings: 12,
    propertyData: '已提供',
    totalHouseholds: 1200,
    residentHouseholds: 980,
    nonResidentHouseholds: 220,
    decoratedNonResident: 180,
    undecorated: 40,
    residentPopulation: 2940,
    populationChange: 15,
    householdChange: 8,
    occupancyRate: 81.7,
    position: [117.250428, 31.84523],
    image: ''
  },
  {
    id: 'residential_2',
    name: '绿城桂花园',
    group: 'B组',
    totalBuildings: 18,
    propertyData: '已提供',
    totalHouseholds: 1800,
    residentHouseholds: 1520,
    nonResidentHouseholds: 280,
    decoratedNonResident: 240,
    undecorated: 40,
    residentPopulation: 4560,
    populationChange: 22,
    householdChange: 12,
    occupancyRate: 84.4,
    position: [117.260428, 31.84123],
    image: ''
  },
  {
    id: 'residential_3',
    name: '万科城市花园',
    group: 'A组',
    totalBuildings: 15,
    propertyData: '已提供',
    totalHouseholds: 1500,
    residentHouseholds: 1280,
    nonResidentHouseholds: 220,
    decoratedNonResident: 190,
    undecorated: 30,
    residentPopulation: 3840,
    populationChange: 18,
    householdChange: 10,
    occupancyRate: 85.3,
    position: [117.255428, 31.83523],
    image: ''
  },
  {
    id: 'residential_4',
    name: '保利香槟国际',
    group: 'C组',
    totalBuildings: 8,
    propertyData: '已提供',
    totalHouseholds: 800,
    residentHouseholds: 720,
    nonResidentHouseholds: 80,
    decoratedNonResident: 70,
    undecorated: 10,
    residentPopulation: 2160,
    populationChange: 5,
    householdChange: 3,
    occupancyRate: 90.0,
    position: [117.265428, 31.83723],
    image: ''
  },
  {
    id: 'residential_5',
    name: '中海滨湖公馆',
    group: 'B组',
    totalBuildings: 20,
    propertyData: '已提供',
    totalHouseholds: 2000,
    residentHouseholds: 1650,
    nonResidentHouseholds: 350,
    decoratedNonResident: 300,
    undecorated: 50,
    residentPopulation: 4950,
    populationChange: 28,
    householdChange: 15,
    occupancyRate: 82.5,
    position: [117.252428, 31.84223],
    image: ''
  }
];

// 根据ID获取小区数据
export const getResidentialById = (id) => {
  return residentialData.find(item => item.id === id) || {};
};

// 获取所有小区位置信息
export const getResidentialPositions = () => {
  return residentialData.map(item => ({
    id: item.id,
    name: item.name,
    position: item.position,
    totalHouseholds: item.totalHouseholds,
    residentPopulation: item.residentPopulation,
    occupancyRate: item.occupancyRate
  }));
};
