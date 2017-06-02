class SessionsController < ApplicationController
  layout false

  def new
  end

  def create
    permitted_params = session_params
    user = User.find_by(email: permitted_params[:email].downcase)
    if user && user.authenticate(permitted_params[:password])
      sign_in user
      redirect_to(permitted_params[:redirect_url] || root_url)
    else
      flash.now[:error] = 'Invalid email or password'
      render 'new'
    end
  end

  def destroy
    sign_out
    redirect_to root_url
  end
    
  private
    def session_params
      params.require(:session).permit(:email, :password, :redirect_url)
    end
end
