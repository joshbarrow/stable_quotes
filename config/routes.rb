Rails.application.routes.draw do
  get "quotes", to: "react#app"
  get "quotes/confirm", to: "react#app"
  get "quotes/receipt", to: "react#app"
end
