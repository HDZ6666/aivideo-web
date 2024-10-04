import { useEffect, useRef, useState } from "react";
import { Map, APILoader, Marker } from "@uiw/react-amap";
import "./index.less";
import { AutoComplete, message } from "antd";
import { debounce } from "lodash";

type IProps = {
	isShow: boolean;
	getLocation: (location: any) => void;
};

const SearchMap = (props: IProps) => {
	const { isShow, getLocation } = props;
	const [location, setLocation] = useState<any>(undefined);
	const [searchValue, setSearchValue] = useState<any>(undefined);
	const [options, setOptions] = useState<any>([]);
	const [mapCompete, setMapCompete] = useState<boolean>(false);
	// const [mapCenter, setMapCenter] = useState<number[]>([116.397428, 39.90923]);
	// const [autoComplete, setAutoComplete] = useState<any>(undefined);

	const mapRef = useRef<any>(null);
	const autoComplete = useRef<any>(null);
	useEffect(() => {
		console.log(mapRef);
		if (mapRef && mapRef.current) {
			const { AMap } = mapRef.current;
			AMap.plugin(["AMap.AutoComplete"], function () {
				const _complete = new AMap.AutoComplete();
				autoComplete.current = _complete;
				// setAutoComplete(_complete);
			});
		}
	}, [mapCompete]);

	useEffect(() => {
		!isShow && reset();
	}, [isShow]);

	useEffect(() => {
		location && getLocation(location);
	}, [location]);

	const reset = () => {
		setLocation(null);
		setSearchValue(undefined);
		setOptions([]);
	};

	const onComplete = () => {
		setMapCompete(true);
	};

	const handleMapClick = (e: any) => {
		// console.log(e.lnglat);
		const { map } = mapRef.current;
		map.setCenter(e.lnglat);
		setLocation(e.lnglat);
	};

	const handleSearch = debounce(async (value: string) => {
		if (value === "") {
			setOptions([]);
			return;
		}
		if (autoComplete && autoComplete.current) {
			let _options = [];
			autoComplete.current.search(value, function (status: any, result: any) {
				// console.log(value);
				// console.log(result.tips);
				if (status === "complete" && result.info === "OK") {
					_options = result.tips.map((item: any, index: number) => {
						return {
							...item,
							key: item.id || `${item.name}_${index}`,
							label: item.name,
							value: item.name
						};
					});
					setOptions(_options);
				} else {
					setOptions([]);
				}
			});
		}
	}, 200);

	const handleSelect = (value: any, option: any) => {
		const { location } = option;
		if (!location) {
			message.error("暂无该定位信息,请重新选择");
			return;
		}
		const { map } = mapRef.current;
		map.setCenter(location);
		setLocation(location);
		setSearchValue(value);
	};

	return (
		<div className="map-container">
			<APILoader akey="7ea103afdbc3ddfbe1469d5ba692c5d9">
				<Map
					doubleClickZoom={false}
					defaultCursor="url('https://webapi.amap.com/theme/v1.3/openhand.cur'), default"
					ref={mapRef}
					onComplete={onComplete}
					onClick={handleMapClick}
					zoom={15}
				>
					{location && <Marker position={location}></Marker>}
					{/* <Geolocation /> */}
				</Map>
				{autoComplete && (
					<AutoComplete
						value={searchValue}
						allowClear
						onSelect={handleSelect}
						onClear={() => setOptions([])}
						placeholder="输入地址搜索"
						onSearch={handleSearch}
						options={options}
						className="search-input"
					/>
				)}
			</APILoader>
		</div>
	);
};

export default SearchMap;
