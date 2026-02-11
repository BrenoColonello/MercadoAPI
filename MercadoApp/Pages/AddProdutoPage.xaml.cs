using MercadoApp.Models;
using MercadoApp.Services;

namespace MercadoApp.Pages;

public partial class AddProdutoPage : ContentPage
{
    private readonly ProdutoApiService _api;
    private string _fotoBase64 = "";

    public AddProdutoPage(ProdutoApiService api)
    {
        _api = api;
        InitializeComponent();
        DataEntrada.Date = DateTime.Today;
        DataValidade.Date = DateTime.Today.AddDays(7);
    }

    public AddProdutoPage() : this(AppServiceProvider.GetRequiredService<ProdutoApiService>()) { }

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
        if (DataValidade.Date < DataEntrada.Date)
        {
            await DisplayAlert("Atenção", "Data de validade deve ser após a data de entrada.", "OK");
            return;
        }
        int qtd = 1;
        if (!string.IsNullOrWhiteSpace(Quantidade.Text) && !int.TryParse(Quantidade.Text, out qtd))
            qtd = 1;
        BtnSalvar.IsEnabled = false;
        try
        {
            var dto = new ProdutoCreateDto
            {
                NomeProduto = nome,
                FotoProduto = _fotoBase64,
                DataEntrada = DataEntrada.Date,
                DataValidade = DataValidade.Date,
                Quantidade = qtd
            };
            await _api.CriarAsync(dto);
            await DisplayAlert("Sucesso", "Produto cadastrado.", "OK");
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
