class Quote < ApplicationRecord
  attr_reader :price

  AT_RISK_DRIVER_RATE = 2000
  SAFE_DRIVER_RATE = 1500

  def price
    at_risk_driver? ?
      AT_RISK_DRIVER_RATE :
      SAFE_DRIVER_RATE
  end

  private

  def license_lookup
    Nyctlc.new(tlc: data.fetch("tlc"))
  end

  delegate :licensed_at_least_3_years?, to: :license_lookup
  alias_method :at_risk_driver?, :licensed_at_least_3_years?
end
