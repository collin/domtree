require 'rubygems'
require 'pathname'
Pathname.send :alias_method, '/', '+'

DIR = Pathname.new("#{Pathname.new(__FILE__).dirname}/..")

module DomTree
  class << self
    def root
      DIR
    end
    
    def vendor
      root/'vendor'
    end
  end
end
