class LicenseLookup
  def initialize(tlc:)
    @tlc = tlc
  end

  def driving_more_than_3_years?
    # here we are going to calculate randomly, but IRL we
    # would be integrating with a 3rd party service
    !(@tlc =~ /[374]/).nil?
  end
end
