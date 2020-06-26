class Nyctlc
  def initialize(tlc:)
    @tlc = tlc
  end

  def licensed_at_least_3_years?
    num_years_licensed >= 3
  end

  def num_years_licensed
    # here we are going to calculate randomly, but IRL we
    # would be integrating with a 3rd party service
    !(@tlc =~ /[374]/).nil? ?
      4 :
      2
  end
end
