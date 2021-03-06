Rails.application.routes.draw do

  root 'dashboard#index'

  get    '/dashboard', to: 'dashboard#index'
  get    '/signin',     to: 'sessions#new'
  post   '/signin',     to: 'sessions#create'
  delete '/signout',    to: 'sessions#destroy'

  resources :users
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
