

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Produk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container py-5">
    <h1>Welcome Admin, {{ $user->name }}</h1>
    {{-- <a href="{{ route('logout') }}">Logout</a> --}}
    <h1 class="text-center mb-4">Halaman Admin - Produk</h1>

    <!-- Form Tambah Produk -->
    <div class="card mb-5">
        <div class="card-header bg-primary text-white">Tambah Produk</div>
        <div class="card-body">
            <form action="{{ url('/api/products') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="row mb-3">
                    <div class="col">
                        <label>Nama Produk</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div class="col">
                        <label>Kategori ID</label>
                        <input type="number" name="category_id" class="form-control" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label>Deskripsi</label>
                    <textarea name="description" class="form-control"></textarea>
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <label>Harga</label>
                        <input type="number" name="price" class="form-control" required>
                    </div>
                    <div class="col">
                        <label>Stok</label>
                        <input type="number" name="stock" class="form-control" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label>Gambar</label>
                    <input type="file" name="img" class="form-control">
                </div>
                <button type="submit" class="btn btn-success">Tambah Produk</button>
            </form>
        </div>
    </div>

    <!-- Tabel Produk -->
    <div class="card">
        <div class="card-header bg-dark text-white">Daftar Produk</div>
        <div class="card-body">
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Gambar</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($products as $product)
                    <tr>
                        <td>{{ $product->id }}</td>
                        <td>
                            @if ($product->img)
                                <img src="{{ asset('storage/'.$product->img) }}" width="70">
                            @else
                                <span class="text-muted">No image</span>
                            @endif
                        </td>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->category_id }}</td>
                        <td>Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                        <td>{{ $product->stock }}</td>
                        <td>
                            <!-- Tombol Edit -->
                            <a href="#" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal{{ $product->id }}">Edit</a>

                            <!-- Tombol Delete -->
                            <form action="{{ url('/api/products/'.$product->id) }}" method="POST" class="d-inline">
                                @method('DELETE')
                                @csrf
                                <button class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin hapus produk ini?')">Hapus</button>
                            </form>
                        </td>
                    </tr>

                    <!-- Modal Edit -->
                    <div class="modal fade" id="editModal{{ $product->id }}" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form action="{{ url('/api/products/'.$product->id) }}" method="POST" enctype="multipart/form-data">
                                    @method('PUT')
                                    @csrf
                                    <div class="modal-header bg-warning">
                                        <h5 class="modal-title">Edit Produk</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-2">
                                            <label>Nama Produk</label>
                                            <input type="text" name="name" value="{{ $product->name }}" class="form-control">
                                        </div>
                                        <div class="mb-2">
                                            <label>Deskripsi</label>
                                            <textarea name="description" class="form-control">{{ $product->description }}</textarea>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col">
                                                <label>Kategori ID</label>
                                                <input type="number" name="category_id" value="{{ $product->category_id }}" class="form-control">
                                            </div>
                                            <div class="col">
                                                <label>Harga</label>
                                                <input type="number" name="price" value="{{ $product->price }}" class="form-control">
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col">
                                                <label>Stok</label>
                                                <input type="number" name="stock" value="{{ $product->stock }}" class="form-control">
                                            </div>
                                            <div class="col">
                                                <label>Gambar Baru</label>
                                                <input type="file" name="img" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="submit" class="btn btn-warning">Simpan Perubahan</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
