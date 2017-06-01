require_relative 'boot'

require 'rails/all'
require 'json'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Fkp
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # disable stylesheets generations on scaffoding
    config.generators do |g|
      g.stylesheets false
    end

    # https://stackoverflow.com/questions/16744279/rails-development-server-is-slow-and-takes-a-long-time-to-load-a-simple-page
    config.assets.enabled = false
  end
end
