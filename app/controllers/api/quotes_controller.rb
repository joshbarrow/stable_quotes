module Api
  class QuotesController < ApplicationController
    def update
      quote = Quote.find(params.fetch(:id)).update(data: {confirmed: true})
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
