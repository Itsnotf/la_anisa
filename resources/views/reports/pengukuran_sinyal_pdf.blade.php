<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Pengukuran Sinyal</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 10px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        .table th {
            background-color: #f2f2f2;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h3 {
            margin: 0;
        }

        .header p {
            margin: 0;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h3>Laporan Pengukuran Sinyal</h3>
        <p>Tanggal Dibuat: {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Kabupaten</th>
                <th>Kecamatan</th>
                <th>Desa</th>
                <th>Provider</th>
                <th>Sinyal</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($data as $item)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td> {{ \Carbon\Carbon::createFromFormat('d/m/Y', $item->tanggal_pengukuran)->format('d/m/Y') }}</td>
                    <td>{{ $item->wilayah->kabupaten ?? '-' }}</td>
                    <td>{{ $item->wilayah->kecamatan ?? '-' }}</td>
                    <td>{{ $item->wilayah->desa ?? '-' }}</td>
                    <td>{{ $item->provider->name ?? '-' }}</td>
                    <td>{{ $item->kekuatan->name ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Tidak ada data yang cocok dengan filter yang
                        diterapkan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>

</html>
