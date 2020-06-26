class Quote < ApplicationRecord
  attr_reader :price

  AT_RISK_DRIVER_RATE = 2000
  SAFE_DRIVER_RATE = 1500

  def price
    at_risk_driver = driving_more_than_3_years?

    at_risk_driver ?
      AT_RISK_DRIVER_RATE :
      SAFE_DRIVER_RATE
  end

  def license_lookup
    LicenseLookup.new(tlc: data.fetch("tlc"))
  end

  private

  delegate :driving_more_than_3_years?, to: :license_lookup

end
