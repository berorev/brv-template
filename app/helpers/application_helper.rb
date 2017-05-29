module ApplicationHelper
  # reference: https://gist.github.com/roberto/3344628
  def bootstrap_alert_class_for(flash_type)
    case flash_type.to_sym
      when :success
        "alert-success"
      when :error
        "alert-error"
      when :alert
        "alert-block"
      when :notice
        "alert-info"
      else
        flash_type.to_s
    end
  end
end
