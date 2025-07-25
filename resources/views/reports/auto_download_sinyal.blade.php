<!DOCTYPE html>
<html>
<head>
    <title>Mempersiapkan Unduhan...</title>
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <p>Unduhan Anda akan dimulai secara otomatis...</p>
        <p>Jika file tidak terunduh, <a href="{{ $url }}" download>klik di sini untuk mengunduh.</a></p>
    </div>
    <script>
        // Mengarahkan ke URL file untuk memicu download
        window.location.href = "{{ $url }}";

        // Tambahan: Setelah beberapa detik, tutup tab ini secara otomatis
        setTimeout(function() {
            window.close();
        }, 5000); // Tutup setelah 5 detik
    </script>
</body>
</html>
