module SessionsHelper
  def sign_in(user)
    session[:user_id] = user.id
  end

  def signed_in?
    !current_user.nil?
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def signed_in_user
    unless signed_in?
      url = signin_url
      url += "?redirect_url=#{CGI::escape(request.url)}" if request.get?
      redirect_to url, notice: 'Please sign in.'
    end
  end

  def sign_out
    session.delete(:user_id)
    @current_user = nil
  end
end
