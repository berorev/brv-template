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

    Typescript::Rails::Compiler.default_options = %w(--target ES5 --noImplicitAny --module commonjs)

    config.app_generators.javascript_engine :typescript

    # Enable the asset pipeline
    config.assets.enabled = true
  end
end
