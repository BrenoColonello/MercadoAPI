using MercadoApp.Converters;
using MercadoApp.Models;
using MercadoApp.Services;

namespace MercadoApp.Pages;

public partial class EditProdutoPage : ContentPage
{
    private readonly ProdutoApiService _api;
    private int _id;
    private string _fotoBase64 = "";

    public EditProdutoPage(ProdutoApiService api)
    {
        _api = api;
        InitializeComponent();
    }

    public EditProdutoPage() : this(AppServiceProvider.GetRequiredService<ProdutoApiService>()) { }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        var idStr = (Shell.Current?.CurrentState?.Location?.ToString() ?? "").Split("id=").LastOrDefault()?.Split("&").FirstOrDefault();
        if (!int.TryParse(idStr, out _id)) return;
        try
        {
            var p = await _api.ObterPorIdAsync(_id);
            if (p == null) { if (Shell.Current != null) await Shell.Current.GoToAsync(".."); return; }
            Nome.Text = p.NomeProduto;
            DataEntrada.Date = p.DataEntrada;
            DataValidade.Date = p.DataValidade;
            Quantidade.Text = p.Quantidade.ToString();
            _fotoBase64 = p.FotoProduto ?? "";
            if (!string.IsNullOrEmpty(p.FotoProduto))
                PreviewFoto.Source = (ImageSource?)new Base64ToImageSourceConverter().Convert(p.FotoProduto, typeof(ImageSource), null, System.Globalization.CultureInfo.CurrentCulture);
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", ex.Message, "OK");
        }
    }

    private async void OnFotoClicked(object? sender, EventArgs e)
    {
        try
        {
            var pick = await DisplayActionSheet("Foto", "Cancelar", null, "Câmera", "Galeria");
            if (pick == "Cancelar" || pick == null) return;
            var photo = pick == "Câmera"
                ? await MediaPicker.CapturePhotoAsync()
                : await MediaPicker.PickPhotoAsync();
            if (photo == null) return;
            await using var stream = await photo.OpenReadAsync();
            using var ms = new MemoryStream();
            await stream.CopyToAsync(ms);
            _fotoBase64 = Convert.ToBase64String(ms.ToArray());
            PreviewFoto.Source = ImageSource.FromStream(() => new MemoryStream(ms.ToArray()));
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", "Não foi possível obter a foto: " + ex.Message, "OK");
        }
    }

    private async void OnSalvarClicked(object? sender, EventArgs e)
    {
        var nome = (Nome.Text ?? "").Trim();
        if (string.IsNullOrEmpty(nome))
        {
            await DisplayAlert("Atenção", "Informe o nome do produto.", "OK");
            return;
        }
        if (!int.TryParse(Quantidade.Text, out var qtd)) qtd = 1;
        BtnSalvar.IsEnabled = false;
        try
        {
            await _api.AtualizarAsync(_id, new ProdutoUpdateDto
            {
                NomeProduto = nome,
                FotoProduto = _fotoBase64,
                DataEntrada = DataEntrada.Date,
                DataValidade = DataValidade.Date,
                Quantidade = qtd
            });
            await DisplayAlert("Sucesso", "Produto atualizado.", "OK");
            await Shell.Current.GoToAsync("..");
        }
        catch (Exception ex)
        {
            await DisplayAlert("Erro", "Não foi possível salvar: " + ex.Message, "OK");
        }
        finally
        {
            BtnSalvar.IsEnabled = true;
        }
    }
}
