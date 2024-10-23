import React from 'react';
import MapView, {LatLng, Marker, Polyline, Region} from "react-native-maps";
import {parsePolyline} from "@/common/parsers/parse-polyline";
import {globalStyles} from "@/core/styles";
import {View} from "react-native";
import {Address, Coordinates} from "@/core/interfaces/ride";


export interface MapSectionProps {
    addresses: Address[];
    polyline: string[];
}

const MapSection: React.FC<MapSectionProps> = ({addresses, polyline}) => {
    const guarujaArea: Coordinates[] = [
        {
            lat: -23.53899224495293,
            lng: -46.64601395314738
        }, {
            lat: -23.56267658157625,
            lng: -46.618631360053875
        }
    ];
    const calculateRegion = (coordinates: Coordinates[]): Region => {
        const points: LatLng[] = coordinates.map((point) => ({latitude: point.lat!, longitude: point.lng!}))
        // Calculate min and max latitudes and longitudes
        const minLat = Math.min(...points.map(point => point.latitude));
        const maxLat = Math.max(...points.map(point => point.latitude));
        const minLng = Math.min(...points.map(point => point.longitude));
        const maxLng = Math.max(...points.map(point => point.longitude));

        // Calculate center point
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // ZoomOut Factor
        const zoomOutFactor = addresses ? 1.6 : 1.8;
        // Calculate Delta
        const latDelta = points.length === 1 ? 0.0070 : (maxLat - minLat) * zoomOutFactor;
        const lngDelta = points.length === 1 ? 0.0070 : (maxLng - minLng) * zoomOutFactor;

        // Define the region
        return {
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
        };
    }
    const renderMarkers = () =>
        addresses.map((address, idx) => (
            <Marker key={`MK${idx}${address.lat}${address.lng}`}
                    coordinate={{latitude: address.lat!, longitude: address.lng!}}
                    pinColor="#0769B4"
            />
        ));
    const renderPolyline = () => {
        const coordinates = polyline.flatMap((p) => {
            if (!p) {
                return [{latitude: 0, longitude: 0}]
            }
            const decodedPolyline = parsePolyline(p);
            return decodedPolyline.polyline;
        });
        return (
            <Polyline strokeWidth={3} strokeColor="#0769B4AA" coordinates={coordinates}/>
        );
    }

    return (
        <View style={[globalStyles.shadowProps, {
            borderRadius: 8,
            overflow: 'hidden',
            marginVertical: 10,
        }]}>
            <MapView style={{height: 180, width: '100%'}}
                     moveOnMarkerPress={false}
                     zoomEnabled={false}
                     zoomControlEnabled={false}
                     showsUserLocation={true}
                     scrollEnabled={false}
                     rotateEnabled={false}
                     pitchEnabled={false}
                     zoomTapEnabled={false}
                     region={calculateRegion(addresses.length ? addresses : guarujaArea)}>
                {addresses && renderMarkers()}
                {polyline && renderPolyline()}
            </MapView>
        </View>
    );
};

export default MapSection;