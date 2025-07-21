'use client';

import { PengukuranSinyal } from '@/types';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Perbaikan untuk ikon Leaflet yang hilang di build modern
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function SignalMap({ data }: { data: PengukuranSinyal[] }) {

    console.log('Data untuk peta:', data);

    const center: [number, number] = data.length > 0 && data[0].wilayah
        ? [data[0].wilayah.latitude, data[0].wilayah.longitude]
        : [-2.548926, 118.0148634];

    return (
        <MapContainer center={center} zoom={data.length > 0 ? 13 : 5} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((pengukuran) => (
                 pengukuran.wilayah && (
                    <Marker key={pengukuran.id} position={[pengukuran.wilayah.latitude, pengukuran.wilayah.longitude]}>
                        <Popup>
                            <b>{pengukuran.wilayah.desa}, {pengukuran.wilayah.kecamatan}</b><br />
                            Provider: {pengukuran.provider?.name}<br />
                            Sinyal: {pengukuran.kekuatan?.name}
                        </Popup>
                    </Marker>
                 )
            ))}
        </MapContainer>
    );
}
