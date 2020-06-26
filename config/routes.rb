Rails.application.routes.draw do
  get "quotes", to: "react#app"
  get "quotes/:id/confirm", to: "react#app"
  get "quotes/receipt", to: "react#app"
  namespace :api do
    resources :quotes, only: [:create, :update, :show]
  end
end
