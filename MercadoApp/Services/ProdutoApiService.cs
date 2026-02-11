using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using MercadoApp.Models;

namespace MercadoApp.Services;

public class ProdutoApiService
{
    private readonly HttpClient _http;
    private readonly JsonSerializerOptions _jsonOpt = new() { PropertyNameCaseInsensitive = true };

    public ProdutoApiService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<ProdutoDto>> ListarAsync(string? busca = null, CancellationToken ct = default)
    {
        var url = "api/produtos";
        if (!string.IsNullOrWhiteSpace(busca))
            url += "?busca=" + Uri.EscapeDataString(busca);
        var list = await _http.GetFromJsonAsync<List<ProdutoDto>>(url, _jsonOpt, ct);
        return list ?? new List<ProdutoDto>();
    }

    public async Task<ProdutoDto?> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        return await _http.GetFromJsonAsync<ProdutoDto>($"api/produtos/{id}", _jsonOpt, ct);
    }

    public async Task<ProdutoDto?> CriarAsync(ProdutoCreateDto dto, CancellationToken ct = default)
    {
        var res = await _http.PostAsJsonAsync("api/produtos", dto, _jsonOpt, ct);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<ProdutoDto>(_jsonOpt, ct);
    }

    public async Task<ProdutoDto?> AtualizarAsync(int id, ProdutoUpdateDto dto, CancellationToken ct = default)
    {
        var res = await _http.PutAsJsonAsync($"api/produtos/{id}", dto, _jsonOpt, ct);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<ProdutoDto>(_jsonOpt, ct);
    }

    public async Task ConferirAsync(int id, ConferirDto? body = null, CancellationToken ct = default)
    {
        var res = await _http.PatchAsync($"api/produtos/{id}/conferir",
            body != null ? new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json") : null, ct);
        res.EnsureSuccessStatusCode();
    }

    public async Task ExcluirAsync(int id, CancellationToken ct = default)
    {
        var res = await _http.DeleteAsync($"api/produtos/{id}", ct);
        res.EnsureSuccessStatusCode();
    }
}
