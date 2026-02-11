using MercadoApp.Models;
using MercadoApp.Services;

namespace MercadoApp.Pages;

public partial class ListaProdutosPage : ContentPage
{
    private readonly ProdutoApiService _api;
    private string _busca = "";

    public ListaProdutosPage(ProdutoApiService api)
    {
        _api = api;
        InitializeComponent();
    }

    public ListaProdutosPage() : this(AppServiceProvider.GetRequiredService<ProdutoApiService>()) { }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await CarregarLista();
    }

    private async Task CarregarLista()
    {
        Loading.IsVisible = Loading.IsRunning = true;
        try
        {
            var lista = await _api.ListarAsync(string.IsNullOrWhiteSpace(_busca) ? null : _busca);
            Lista.ItemsSource = lista;
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", "Não foi possível carregar os produtos. Verifique se a API está rodando.\n" + ex.Message, "OK");
        }
        finally
        {
            Loading.IsVisible = Loading.IsRunning = false;
        }
    }

    private async void OnRefreshing(object? sender, EventArgs e)
    {
        await CarregarLista();
        RefreshView.IsRefreshing = false;
    }

    private void OnBuscaChanged(object? sender, TextChangedEventArgs e)
    {
        _busca = e.NewTextValue ?? "";
        _ = CarregarLista();
    }

    private async void OnAdicionarClicked(object? sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("AddProduto");
    }

    private void OnItemTapped(object? sender, TappedEventArgs e)
    {
        if (e.Parameter is ProdutoDto p)
            _ = Shell.Current.GoToAsync($"EditProduto?id={p.Id}");
    }

    private async void OnConferirClicked(object? sender, EventArgs e)
    {
        if (sender is not Button btn || btn.CommandParameter is not ProdutoDto p) return;
        var novaData = await DisplayPromptAsync("Conferir produto", "Produto já saiu do estoque. Nova data de validade (deixe em branco para manter)?", "OK", "Cancelar", initialValue: p.DataValidade.ToString("dd/MM/yyyy"), keyboard: Keyboard.Default);
        if (novaData == null) return; // cancel
        Loading.IsVisible = Loading.IsRunning = true;
        try
        {
            if (!string.IsNullOrWhiteSpace(novaData) && DateTime.TryParse(novaData, out var dt))
                await _api.ConferirAsync(p.Id, new Models.ConferirDto { NovaDataValidade = dt });
            else
                await _api.ConferirAsync(p.Id);
            await CarregarLista();
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", ex.Message, "OK");
        }
        finally
        {
            Loading.IsVisible = Loading.IsRunning = false;
        }
    }

    private async void OnEditarClicked(object? sender, EventArgs e)
    {
        if (sender is not Button btn || btn.CommandParameter is not ProdutoDto p) return;
        await Shell.Current.GoToAsync($"EditProduto?id={p.Id}");
    }

    private async void OnExcluirClicked(object? sender, EventArgs e)
    {
        if (sender is not Button btn || btn.CommandParameter is not ProdutoDto p) return;
        if (!await DisplayAlert("Excluir", $"Excluir \"{p.NomeProduto}\"?", "Excluir", "Cancelar")) return;
        Loading.IsVisible = Loading.IsRunning = true;
        try
        {
            await _api.ExcluirAsync(p.Id);
            await CarregarLista();
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", ex.Message, "OK");
        }
        finally
        {
            Loading.IsVisible = Loading.IsRunning = false;
        }
    }
}
