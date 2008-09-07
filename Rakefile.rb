require 'pathname'

task :cleanup do
  Pathname.send :rm_r, Pathname.glob('**/*~'), :force => true
end
