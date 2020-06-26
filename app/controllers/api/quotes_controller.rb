module Api
  class QuotesController < ApiController
    def update
      quote = Quote.find(params.fetch(:id))
      quote.data = quote.data.merge(params.require(:data).permit(:confirmed))
      quote.save
      render json: quote
    end

    def show
      quote = Quote.find params.fetch(:id)
      render json: quote
    end

    def create
      quote = Quote.create(
        data: {
          email: params.fetch(:email),
          tlc: params.fetch(:tlc),
          name: params.fetch(:name),
          quote: nil,
          confirmed: false,
        }
      )
      render json: quote
    end
  end
end
